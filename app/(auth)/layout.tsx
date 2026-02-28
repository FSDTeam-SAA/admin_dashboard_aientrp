import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth | eWash Dashboard",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main 
      className="relative flex min-h-screen items-center justify-center p-4 sm:p-8 bg-cover bg-center bg-no-repeat"
      style={{ 
        // Gradient overlay + Background image
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.54)), url('/login-bg-image.jpg')`, 
        backgroundColor: "#000000" // Dark fallback
      }}
    >
      {/* The white card container with high contrast against the dark overlay.
        Rounded corners set to 32px to match the modern dashboard aesthetic.
      */}
      <div className="relative z-10 w-full max-w-[550px] rounded-[32px] bg-white p-8 sm:p-14 shadow-2xl">
        {children}
      </div>
    </main>
  );
}