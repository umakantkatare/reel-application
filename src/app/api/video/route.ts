import { response } from "@/lib/api-response";
import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    await connectToDb();

    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return response(
        {
          message: "No videos found",
          videos: [],
        },
        200,
      );
    }
    return response(videos, 200);
  } catch (error) {
    return response({ error: "Failed to fetch videos" }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return response({ error: "Unauthorized" }, 401);
    }
    const body: IVideo = await req.json();

    const isMissingFields =
      !body.title || !body.description || !body.videoUrl || !body.thumbnailUrl;

    if (isMissingFields) {
      return response({ message: "All fields are required" }, 400);
    }

    await connectToDb();

    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: body?.transformation?.height ?? 1920,
        width: body?.transformation?.width ?? 1080,
        quality: body?.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);

    return response(newVideo, 201);
  } catch (error) {
    return response({ error: "Failed to upload videos" }, 500);
  }
}
