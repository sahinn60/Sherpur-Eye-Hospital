"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Camera, X, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui";

interface Props {
  onCapture: (dataUrl: string) => void;
  onCancel:  () => void;
}

export function CameraCapture({ onCapture, onCancel }: Props) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const streamRef  = useRef<MediaStream | null>(null);

  const [preview,  setPreview]  = useState<string | null>(null);
  const [error,    setError]    = useState("");
  const [starting, setStarting] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const startCamera = useCallback(async (mode: "user" | "environment") => {
    // Stop any existing stream
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStarting(true); setError(""); setPreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setError("ক্যামেরা চালু করা যায়নি। অনুমতি দিন এবং আবার চেষ্টা করুন।");
    } finally { setStarting(false); }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, [facingMode, startCamera]);

  function capture() {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d")!;
    // Mirror for front camera
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    setPreview(dataUrl);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }

  function retake() {
    setPreview(null);
    startCamera(facingMode);
  }

  function confirm() {
    if (preview) onCapture(preview);
  }

  function flipCamera() {
    setFacingMode((m) => (m === "user" ? "environment" : "user"));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60">
        <button onClick={onCancel} className="text-white p-2 rounded-full hover:bg-white/10">
          <X size={22} />
        </button>
        <p className="text-white text-sm font-medium">সেলফি তুলুন</p>
        <button onClick={flipCamera} className="text-white p-2 rounded-full hover:bg-white/10">
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Camera / Preview */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {error ? (
          <div className="text-center px-6">
            <Camera size={48} className="text-gray-500 mx-auto mb-3" />
            <p className="text-white text-sm">{error}</p>
            <button onClick={() => startCamera(facingMode)}
              className="mt-4 text-sm text-blue-400 underline">আবার চেষ্টা করুন</button>
          </div>
        ) : preview ? (
          <img src={preview} alt="preview" className="max-h-full max-w-full object-contain" />
        ) : (
          <>
            {starting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay playsInline muted
              className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
            />
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-52 h-64 rounded-full border-2 border-white/50 border-dashed" />
            </div>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom controls */}
      <div className="bg-black/60 px-6 py-6 flex items-center justify-center gap-8">
        {preview ? (
          <>
            <button onClick={retake}
              className="flex flex-col items-center gap-1 text-white/70 hover:text-white">
              <RotateCcw size={24} />
              <span className="text-xs">আবার</span>
            </button>
            <button onClick={confirm}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-lg">
              <Check size={28} className="text-white" />
            </button>
          </>
        ) : (
          <button onClick={capture} disabled={starting || !!error}
            className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center shadow-lg border-4 border-gray-300">
            <Camera size={28} className="text-gray-800" />
          </button>
        )}
      </div>
    </div>
  );
}
