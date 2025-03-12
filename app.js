let mediaRecorder;
let recordedChunks = [];
let currentStream;

async function startRecording() {
    try {
        // Solicita permissão para usar a câmera e o microfone
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        // Exibe o vídeo na tela
        document.getElementById("videoElement").srcObject = stream;
        currentStream = stream; // Armazena o stream atual
        
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
        mediaRecorder.onstop = () => {
            saveVideo();
            stopCamera(); // Fecha a câmera depois de parar a gravação
        };
        mediaRecorder.start();

        // Desabilita o botão de iniciar e habilita o de parar
        document.getElementById("startBtn").disabled = true;
        document.getElementById("stopBtn").disabled = false;
    } catch (err) {
        console.error("Erro ao acessar a mídia:", err);
        alert("Erro ao acessar a câmera ou microfone.");
    }
}

function stopRecording() {
    mediaRecorder.stop();
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
}

function saveVideo() {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `video_${new Date().toISOString().replace(/[:.]/g, "_")}.webm`;
    a.click();
    
    URL.revokeObjectURL(url);
    recordedChunks = [];
}

function stopCamera() {
    if (currentStream) {
        const tracks = currentStream.getTracks();
        tracks.forEach(track => track.stop()); // Para todos os tracks (vídeo e áudio)
        document.getElementById("videoElement").srcObject = null; // Remove o stream da tela
    }
}


