# MembershipForm Component

## Overview

A professional, fully-validated membership application form with real-time validation, loading states, and success feedback.

## Features

- React Hook Form for form state management
- Zod schema validation
- Real-time field validation
- Loading state during submission
- Success message after submission
- Auto-clear form on success
- Disabled submit button during loading
- Beautiful UI with icons and proper spacing
- Responsive design
- Accessible form elements

## Technology Stack

### Form Management

- **react-hook-form**: Form state and submission handling
- **@hookform/resolvers**: Zod resolver integration
- **zod**: Schema validation

### UI Components

- **shadcn/ui Form**: Form wrapper and field components
- **shadcn/ui Input**: Text input fields
- **shadcn/ui Textarea**: Multi-line text input
- **shadcn/ui Button**: Submit button
- **lucide-react**: Icons

## Form Fields

### 1. Name (Required)

- **Type**: Text input
- **Validation**:
  - Minimum 2 characters
  - Maximum 100 characters
- **Icon**: User icon
- **Placeholder**: "Enter your full name"

### 2. Email (Required)

- **Type**: Email input
- **Validation**: Valid email format
- **Icon**: Mail icon
- **Placeholder**: "your.email@example.com"

### 3. Phone (Optional)

- **Type**: Tel input
- **Validation**:
  - Exactly 10 digits (if provided)
  - No spaces or dashes
- **Icon**: Phone icon
- **Placeholder**: "1234567890"
- **Helper Text**: "Enter 10-digit phone number without spaces or dashes"

### 4. Subject (Required)

- **Type**: Text input
- **Validation**:
  - Minimum 3 characters
  - Maximum 200 characters
- **Icon**: MessageSquare icon
- **Placeholder**: "e.g., Membership Application"

### 5. Message (Required)

- **Type**: Textarea
- **Validation**:
  - Minimum 10 characters
  - Maximum 1000 characters
- **Rows**: 150px minimum height
- **Placeholder**: "Tell us why you want to join..."
- **Helper Text**: "Minimum 10 characters required"

## Validation Schema

```typescript
const membershipFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z.string().email("Please enter a valid email address"),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), "Phone number must be exactly 10 digits"),

  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must not exceed 200 characters"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});
```

## Form States

### 1. Default State

- All fields empty
- Submit button enabled
- No error messages

### 2. Validation State

- Real-time validation on blur
- Error messages appear below fields
- Red border on invalid fields
- Submit button disabled if form invalid

### 3. Submitting State

- Submit button shows loading spinner
- Button text: "Submitting Application..."
- Button disabled
- Form fields remain editable

### 4. Success State

- Green success banner appears
- Success message displayed
- Form fields cleared
- Success banner auto-hides after 5 seconds

## Component Structure

```
MembershipForm
├── Background Pattern (SVG)
├── Header Section
│   ├── Title
│   └── Description
├── Success Message (conditional)
├── Form Card
│   ├── Name Field
│   ├── Email Field
│   ├── Phone Field
│   ├── Subject Field
│   ├── Message Field
│   ├── Submit Button
│   └── Additional Info Section
└── Contact Info
```

## Styling

### Colors

- **Primary**: Dark blue (#111184)
- **Background**: Gradient from primary-50 to white
- **Card**: White with shadow
- **Success**: Green (green-50, green-600)
- **Error**: Red (red-500)
- **Icons**: Gray-400

### Focus States

- Border color changes to primary
- Ring color: primary
- Smooth transitions

### Spacing

- Section padding: py-16 lg:py-24
- Form fields: space-y-6
- Card padding: p-8 lg:p-12

## User Flow

1. **User fills out form**
   - Real-time validation on each field
   - Error messages appear immediately

2. **User clicks Submit**
   - Form validates all fields
   - If invalid, shows errors and prevents submission
   - If valid, proceeds to submission

3. **During Submission**
   - Button shows loading spinner
   - Button disabled
   - 2-second simulated delay (replace with actual API call)

4. **After Successful Submission**
   - Success message appears
   - Form fields cleared
   - Success message auto-hides after 5 seconds

## Integration Points

### Current (Mock)

```typescript
const onSubmit = async (data: MembershipFormValues) => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Form submitted:", data);
};
```

### Future (Email Integration)

#### Option 1: API Route

```typescript
const onSubmit = async (data: MembershipFormValues) => {
  const response = await fetch("/api/membership", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Submission failed");
  const result = await response.json();
};
```

#### Option 2: Resend Email Service

```typescript
// In /app/api/membership/route.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const data = await request.json();

  await resend.emails.send({
    from: "gouravsuvo@gmail.com",
    to: process.env.ADMIN_EMAIL,
    subject: `New Membership: ${data.subject}`,
    html: `
      <h2>New Membership Application</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong> ${data.message}</p>
    `,
  });

  return Response.json({ success: true });
}
```

## Error Handling

### Validation Errors

- Displayed below each field
- Red text color
- Clear, user-friendly messages

### Submission Errors

```typescript
try {
  // Submit form
} catch (error) {
  console.error("Error submitting form:", error);
  // TODO: Show error toast/message
  // Consider using react-hot-toast or sonner
}
```

## Accessibility

- Semantic HTML form elements
- Proper label associations
- ARIA attributes from shadcn/ui
- Keyboard navigation support
- Focus management
- Error announcements for screen readers
- Required field indicators

## Responsive Design

### Mobile (< 640px)

- Full-width form
- Stacked layout
- Touch-friendly input sizes
- Adequate spacing

### Tablet (640px - 1024px)

- Centered form with max-width
- Comfortable input sizes

### Desktop (> 1024px)

- Max-width container (4xl)
- Optimal line length
- Generous padding

## Customization

### Change Field Validations

```typescript
// Make phone required
phone: z.string()
  .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

// Change message min length
message: z.string()
  .min(20, "Message must be at least 20 characters"),
```

### Add New Fields

```typescript
// Add to schema
const schema = z.object({
  // ... existing fields
  organization: z.string().optional(),
});

// Add to form
<FormField
  control={form.control}
  name="organization"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Organization</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

### Change Success Message Duration

```typescript
// Current: 5 seconds
setTimeout(() => {
  setIsSuccess(false);
}, 5000);

// Change to 10 seconds
setTimeout(() => {
  setIsSuccess(false);
}, 10000);
```

### Customize Submit Button

```typescript
<Button
  type="submit"
  size="lg"
  disabled={isSubmitting}
  className="w-full bg-accent text-white hover:bg-accent/90"
>
  {/* Custom content */}
</Button>
```

## Testing Checklist

- [ ] All required fields show errors when empty
- [ ] Email validation works correctly
- [ ] Phone validation accepts 10 digits only
- [ ] Form submits when all fields valid
- [ ] Loading state shows during submission
- [ ] Success message appears after submission
- [ ] Form clears after successful submission
- [ ] Success message auto-hides after 5 seconds
- [ ] Submit button disabled during submission
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## Future Enhancements

1. **Email Integration**
   - Connect to Resend or SendGrid
   - Send confirmation email to user
   - Send notification to admin

2. **File Upload**
   - Add document upload field
   - Support for ID proof, photos

3. **Multi-step Form**
   - Break into multiple steps
   - Progress indicator
   - Save draft functionality

4. **Captcha**
   - Add reCAPTCHA
   - Prevent spam submissions

5. **Toast Notifications**
   - Use react-hot-toast or sonner
   - Better error feedback

6. **Form Analytics**
   - Track submission rates
   - Monitor field completion
   - A/B testing

## Troubleshooting

### Form Not Submitting

- Check validation errors
- Verify all required fields filled
- Check browser console for errors

### Validation Not Working

- Ensure Zod schema is correct
- Check resolver is properly configured
- Verify field names match schema

### Success Message Not Showing

- Check isSuccess state
- Verify setTimeout is working
- Check CSS classes applied

### Styling Issues

- Ensure Tailwind classes compiled
- Check for conflicting styles
- Verify shadcn/ui components installed
