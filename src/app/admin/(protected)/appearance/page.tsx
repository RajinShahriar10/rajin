import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAppearancePage() {
  return (
    <div>
      <AdminPageHeader
        title="Appearance"
        description="Visual preferences for the admin interface."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>
            The admin interface follows your system theme. Automatic light/dark switching
            is controlled by your operating system settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Public site styling is managed in the Tailwind theme tokens. Theme customization
            is coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
