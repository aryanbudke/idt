import { SignUp } from "@clerk/nextjs";
import { GraduationCap } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-on-surface">EduCore ERP</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Create your account
            </p>
          </div>
        </div>

        {/* Clerk Sign-Up Component */}
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm p-0 w-full",
              main: "p-8",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "rounded-lg border border-outline-variant bg-surface text-on-surface hover:bg-surface-container text-sm font-medium",
              formFieldLabel: "text-sm font-medium text-on-surface-variant",
              formFieldInput:
                "rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-0",
              formButtonPrimary:
                "rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-[#004395] transition-colors",
              footerActionLink: "text-primary font-medium hover:underline",
              identityPreviewEditButton: "text-primary",
              dividerLine: "bg-outline-variant",
              dividerText: "text-on-surface-variant text-xs",
              formFieldInputShowPasswordButton: "text-on-surface-variant",
              alertText: "text-sm text-red-600",
              formResendCodeLink: "text-primary",
            },
          }}
        />
      </div>
    </div>
  );
}
