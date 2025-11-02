"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function HeroCarousel() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(true);
  const [videoUrl, setVideoUrl] = React.useState<string>("/videos/hero-video.mp4");
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch video from database
  React.useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch("/api/hero-video/get");
        if (response.ok) {
          const data = await response.json();
          setVideoUrl(data.video.videoUrl);
        }
        // If no video found or error, use default video
      } catch (error) {
        console.error("Error fetching hero video:", error);
        // Use default video on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full">
      <div className="relative h-[400px] w-full overflow-hidden md:h-[500px] lg:h-[600px]">
        {/* Video Background */}
        {!isLoading && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={true}
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            key={videoUrl}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>
      </div>
    </section>
  );
}
