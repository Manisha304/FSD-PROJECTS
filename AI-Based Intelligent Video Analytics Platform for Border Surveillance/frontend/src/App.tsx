import React, { useEffect, useState, useRef } from 'react';
import { Camera, Car, AlertTriangle, ShieldAlert, Upload, Video } from 'lucide-react';

interface Vehicle {
  id: string;
  type: string;
  plate: string;
  status: 'REGISTERED' | 'UNKNOWN' | 'WATCHLIST';
  threat_score: number;
  camera_history: string[];
}

interface Event {
  type: string;
  timestamp: string;
  camera_id: string;
  zone: string;
  vehicle: Vehicle;
  ocr_confidence: number;
}

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onmessage = (event) => {
      const data: Event = JSON.parse(event.data);
      setEvents((prev) => [data, ...prev].slice(0, 50));
    };
    
    return () => ws.close();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setIsLive(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setVideoUrl(`http://localhost:8000/video_feed?t=${new Date().getTime()}`);
        setEvents([]); 
      } else {
        alert("Server rejected the file upload.");
      }
    } catch (err) {
      console.error('Failed to upload video', err);
      alert("Network error: Could not upload file. Make sure the backend is running.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStartLive = async () => {
    try {
      setIsLive(true);
      const res = await fetch('http://localhost:8000/start_live', { method: 'POST' });
      if (res.ok) {
        setVideoUrl(`http://localhost:8000/video_feed?t=${new Date().getTime()}`);
        setEvents([]); 
      } else {
        alert("Failed to start live camera from backend.");
        setIsLive(false);
      }
    } catch (err) {
      console.error('Failed to start live camera', err);
      alert("Network error: Could not reach the backend to start live camera.");
      setIsLive(false);
    }
  };

  const handleStop = async () => {
    try {
      await fetch('http://localhost:8000/stop', { method: 'POST' });
      setVideoUrl(null);
      setIsLive(false);
      setEvents([]);
    } catch (err) {
      console.error('Failed to stop stream', err);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6 bg-slate-900 text-slate-200">
      <header className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-wider">Intelligent Border Safety Surveillance</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-sm font-semibold uppercase text-slate-400">Live AI Dashboard</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column - Live Camera Stream */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-semibold flex items-center gap-2">
               <Camera className="w-5 h-5" /> Camera Feed (YOLO + ByteTrack)
             </h2>
             <div className="flex gap-2">
               {videoUrl && (
                 <button 
                   onClick={handleStop}
                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold transition-colors"
                 >
                   Stop Stream
                 </button>
               )}
               <button 
                 onClick={handleStartLive}
                 disabled={isLive}
                 className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold transition-colors ${isLive ? 'bg-green-700 text-white cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'}`}
               >
                 <Video className="w-4 h-4" />
                 {isLive ? 'Live Camera Active' : 'Start Live WebCam'}
               </button>
               <input 
                 type="file" 
                 accept="video/*" 
                 ref={fileInputRef}
                 className="hidden" 
                 onChange={handleFileUpload} 
               />
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 disabled={isUploading}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold transition-colors"
               >
                 <Upload className="w-4 h-4" />
                 {isUploading ? 'Uploading...' : 'Upload Video'}
               </button>
             </div>
          </div>
          
          <div className="relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700 w-full flex items-center justify-center" style={{ minHeight: '500px' }}>
            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs font-mono z-10 text-white">
              {isLive ? 'CAM-LIVE | AI PROCESSING' : 'CAM-UPLOAD | AI PROCESSING'}
            </div>
            {videoUrl ? (
              <img 
                src={videoUrl} 
                alt="Live Stream" 
                className="w-full h-auto max-h-[600px] object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                 <Camera className="w-12 h-12 mb-4 opacity-50" />
                 <p>Upload a video or Start Live Camera to begin</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Events Log */}
        <div className="col-span-1 bg-slate-800 rounded-lg border border-slate-700 flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 150px)' }}>
          <div className="p-4 border-b border-slate-700 bg-slate-900 flex justify-between items-center">
             <h2 className="text-lg font-semibold flex items-center gap-2">
              <Car className="w-5 h-5" /> Detected Vehicles & ANPR
            </h2>
            <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">{events.length} logs</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {events.map((e, idx) => (
              <div key={idx} className={`p-3 rounded-lg border-l-4 ${e.vehicle.threat_score > 60 ? 'bg-red-900/20 border-red-500' : e.vehicle.threat_score > 30 ? 'bg-yellow-900/20 border-yellow-500' : 'bg-slate-700/30 border-green-500'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{e.vehicle.plate !== 'UNKNOWN' ? e.vehicle.plate : 'PLATE NOT DETECTED'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                      e.vehicle.status === 'WATCHLIST' ? 'bg-red-500/20 text-red-400' : 
                      e.vehicle.status === 'UNKNOWN' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {e.vehicle.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-300">
                   <div>Global ID: <span className="font-mono text-blue-400">{e.vehicle.id}</span></div>
                   <div>Type: <span className="uppercase text-yellow-400">{e.vehicle.type}</span></div>
                   <div>Cam: {e.camera_id}</div>
                   <div>Zone: {e.zone}</div>
                   {e.vehicle.plate !== 'UNKNOWN' && (
                     <div>OCR Conf: {(e.ocr_confidence * 100).toFixed(1)}%</div>
                   )}
                   <div className="flex items-center gap-1">
                     Threat: 
                     <span className={`font-bold ${e.vehicle.threat_score > 60 ? 'text-red-400' : 'text-green-400'}`}>
                       {e.vehicle.threat_score}
                     </span>
                     {e.vehicle.threat_score > 50 && <AlertTriangle className="w-3 h-3 text-red-400" />}
                   </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center text-slate-500 mt-10">Waiting for AI detections...</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
