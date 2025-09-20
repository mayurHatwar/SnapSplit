import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AlbumGrid } from "@/components/album-grid";
import { CreateAlbumDialog } from "@/components/create-album-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch user's albums with photo counts
  const { data: albums } = await supabase
    .from("albums")
    .select(
      `
      *,
      photos(count)
    `
    )
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Albums</h1>
          <p className="text-muted-foreground mt-2">
            Organize and share your photos with AI-powered face detection
          </p>
        </div>
        <CreateAlbumDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Album
          </Button>
        </CreateAlbumDialog>
      </div>

      <AlbumGrid albums={albums || []} />
    </div>
  );
}
