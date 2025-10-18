import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/lib/env";

// Initialize Resend
const resend = new Resend(env.email.resendApiKey);

// Validation schema matching the form
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must not exceed 100 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: "Phone number must be exactly 10 digits",
    }),
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(200, { message: "Subject must not exceed 200 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must not exceed 1000 characters" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Rate limiting: Store submission timestamps per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_SUBMISSIONS = 5;

/**
 * Check if IP has exceeded rate limit
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Filter out timestamps older than 1 hour
  const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentTimestamps.length >= MAX_SUBMISSIONS) {
    return false; // Rate limit exceeded
  }

  // Add current timestamp and update map
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);

  return true; // Within rate limit
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback to a default value
  return "unknown";
}

/**
 * Generate HTML email template
 */
function generateEmailTemplate(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #111184 0%, #1a1a9e 100%);
          color: #ffffff;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          margin: -30px -30px 30px -30px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .field {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e5e5;
        }
        .field:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #111184;
          margin-bottom: 5px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .value {
          color: #333;
          font-size: 16px;
          word-wrap: break-word;
        }
        .message-box {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #111184;
          margin-top: 10px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e5e5;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        .badge {
          display: inline-block;
          background-color: #14b8a6;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 New Membership Application</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Asansol Coalfield Diabetes Association</p>
        </div>

        <div class="field">
          <div class="label">Applicant Name</div>
          <div class="value">${data.name}</div>
        </div>

        <div class="field">
          <div class="label">Email Address</div>
          <div class="value">
            <a href="mailto:${data.email}" style="color: #111184; text-decoration: none;">
              ${data.email}
            </a>
          </div>
        </div>

        ${
          data.phone
            ? `
        <div class="field">
          <div class="label">Phone Number</div>
          <div class="value">
            <a href="tel:${data.phone}" style="color: #111184; text-decoration: none;">
              ${data.phone}
            </a>
          </div>
        </div>
        `
            : ""
        }

        <div class="field">
          <div class="label">Subject</div>
          <div class="value">${data.subject}</div>
        </div>

        <div class="field">
          <div class="label">Message</div>
          <div class="message-box">
            ${data.message.replace(/\n/g, "<br>")}
          </div>
        </div>

        <div class="footer">
          <div class="badge">NEW APPLICATION</div>
          <p style="margin-top: 15px;">
            Received on ${new Date().toLocaleString("en-IN", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Kolkata",
            })}
          </p>
          <p style="margin-top: 10px; font-size: 12px; color: #999;">
            This is an automated message from the ACDA membership system.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * POST handler for contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        {
          success: false,
          error: "Too many submissions. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate data with Zod
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.issues,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Log submission (without sensitive data in production)
    console.log("Processing contact form submission:", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      timestamp: new Date().toISOString(),
    });

    // Send email using Resend
    const emailResult = await resend.emails.send({
      // from: "ACDA Membership <noreply@acdacon.org>",
      from: "gouravsuvo@gmail.com",
      to: env.email.adminEmail,
      replyTo: data.email,
      subject: `New Contact Form Submission - ACDA: ${data.subject}`,
      html: generateEmailTemplate(data),
    });

    // Check if email was sent successfully
    if (emailResult.error) {
      console.error("Resend API error:", emailResult.error);
      throw new Error(`Failed to send email: ${emailResult.error.message}`);
    }

    console.log("Email sent successfully:", emailResult.data?.id);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Your application has been submitted successfully",
        emailId: emailResult.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error with details
    console.error("Error processing contact form:", error);

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while processing your submission. Please try again later.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - return method not allowed
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
      code: "METHOD_NOT_ALLOWED",
    },
    { status: 405 }
  );
}
