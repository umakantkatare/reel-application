import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

type fetchOptions = {
  method?: "GET" | "POST" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
};

class ApiClient {
  private async fetchRequest<T>(
    endpoint: string,
    options: fetchOptions = {},
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status} , message: ${await response.text()}`,
      );
    }
    return response.json();
  }

  async getVideos() {
    return this.fetchRequest<IVideo[]>("/videos");
  }

  async getVideoById(id: string) {
    return this.fetchRequest<IVideo>(`/videos/${id}`);
  }

  async createVideo(videoData: VideoFormData) {
    return this.fetchRequest<IVideo>("/videos", {
      method: "POST",
      body: videoData,
    });
  }

  async deleteVideo(id: string) {
    return this.fetchRequest<void>(`/videos/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
