/**
 * AnnouncementBar Usage Examples
 * Copy and paste these examples into your layout.tsx
 */

import AnnouncementBar from "@/components/AnnouncementBar";

// ============================================
// EXAMPLE 1: Basic Info Announcement (Default)
// ============================================
export function Example1() {
  return (
    <AnnouncementBar
      message="🏥 Next Health Camp: October 25th, 2025 - Free Diabetes Screening Available"
      priority="info"
    />
  );
}

// ============================================
// EXAMPLE 2: Warning Announcement
// ============================================
export function Example2() {
  return (
    <AnnouncementBar
      message="⚠️ Clinic will be closed on Sunday, October 20th for maintenance"
      priority="warning"
      storageKey="maintenance-oct-2025"
    />
  );
}

// ============================================
// EXAMPLE 3: Urgent Announcement
// ============================================
export function Example3() {
  return (
    <AnnouncementBar
      message="🚨 Emergency: Appointments rescheduled. Please call (555) 123-4567"
      priority="urgent"
      storageKey="emergency-alert"
      dismissDuration={12} // Reappears after 12 hours
    />
  );
}

// ============================================
// EXAMPLE 4: Event with Custom Duration
// ============================================
export function Example4() {
  return (
    <AnnouncementBar
      message="📅 World Diabetes Day Celebration - November 14th. Join us for awareness activities!"
      priority="info"
      storageKey="world-diabetes-day-2025"
      dismissDuration={168} // 7 days
    />
  );
}

// ============================================
// EXAMPLE 5: New Service Announcement
// ============================================
export function Example5() {
  return (
    <AnnouncementBar
      message="✨ New: Online appointment booking now available! Book your consultation today."
      priority="info"
      storageKey="online-booking-launch"
      dismissDuration={72} // 3 days
    />
  );
}

// ============================================
// EXAMPLE 6: Seasonal Hours
// ============================================
export function Example6() {
  return (
    <AnnouncementBar
      message="🕐 Holiday Hours: December 24-26 - Emergency services only"
      priority="warning"
      storageKey="holiday-hours-2025"
    />
  );
}

// ============================================
// EXAMPLE 7: Community Outreach
// ============================================
export function Example7() {
  return (
    <AnnouncementBar
      message="🤝 Free diabetes education workshop every Saturday at 10 AM. All are welcome!"
      priority="info"
      storageKey="weekly-workshop"
      dismissDuration={48}
    />
  );
}

// ============================================
// EXAMPLE 8: Donation Drive
// ============================================
export function Example8() {
  return (
    <AnnouncementBar
      message="❤️ Support our cause: Donate to help provide free diabetes care to underserved communities"
      priority="info"
      storageKey="donation-drive-2025"
      dismissDuration={168} // 7 days
    />
  );
}

// ============================================
// HOW TO USE IN LAYOUT.TSX
// ============================================

/*
import AnnouncementBar from "@/components/AnnouncementBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <AnnouncementBar 
            message="🏥 Next Health Camp: October 25th, 2025"
            priority="info"
          />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
*/

// ============================================
// DYNAMIC ANNOUNCEMENTS (Advanced)
// ============================================

/*
// You can also make announcements dynamic based on conditions:

export default function RootLayout({ children }) {
  const currentDate = new Date();
  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          {isWeekend ? (
            <AnnouncementBar 
              message="Weekend hours: 9 AM - 2 PM. Emergency services available 24/7"
              priority="info"
            />
          ) : (
            <AnnouncementBar 
              message="🏥 Next Health Camp: October 25th, 2025"
              priority="info"
            />
          )}
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
*/
