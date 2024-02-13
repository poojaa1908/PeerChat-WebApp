let APP_ID = "YOUR-APP-ID";

let token = null;
let uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;

let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get('room');

if (!roomId) {
    window.location = 'lobby.html';
}

let localStream;
let remoteStream;
let peerConnection;
let speechRecognition;
let subtitlesElement = document.getElementById('subtitles');

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
};

const constraints = {
    video: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
    },
    audio: true
};

let init = async () => {
    client = await AgoraRTM.createInstance(APP_ID);
    await client.login({ uid, token });

    channel = client.createChannel(roomId);
    await channel.join();

    channel.on('MemberJoined', handleUserJoined);
    channel.on('MemberLeft', handleUserLeft);

    client.on('MessageFromPeer', handleMessageFromPeer);

    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById('user-1').srcObject = localStream;
    let currentSentence = '';
    // Start speech recognition
    if (localStream) {
        startSpeechRecognition(localStream);
    }
};

let handleUserLeft = (MemberId) => {
    document.getElementById('user-2').style.display = 'none';
    document.getElementById('user-1').classList.remove('smallFrame');
};

let handleMessageFromPeer = async (message, MemberId) => {
    message = JSON.parse(message.text);

    if (message.type === 'offer') {
        createAnswer(MemberId, message.offer);
    } else if (message.type === 'answer') {
        addAnswer(message.answer);
    } else if (message.type === 'candidate') {
        if (peerConnection) {
            peerConnection.addIceCandidate(message.candidate);
        }
    } else if (message.type === 'subtitles') {
        handleSubtitlesFromPeer(message.subtitles);
    }
};

let handleUserJoined = async (MemberId) => {
    console.log('A new user joined the channel:', MemberId);
    createOffer(MemberId);
};

let createPeerConnection = async (MemberId) => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById('user-2').srcObject = remoteStream;
    document.getElementById('user-2').style.display = 'block';

    document.getElementById('user-1').classList.add('smallFrame');

    if (!localStream) {
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        document.getElementById('user-1').srcObject = localStream;
    }

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'candidate', 'candidate': event.candidate }) }, MemberId);
        }
    };
};

let createOffer = async (MemberId) => {
    await createPeerConnection(MemberId);

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'offer', 'offer': offer }) }, MemberId);
};

let createAnswer = async (MemberId, offer) => {
    await createPeerConnection(MemberId);

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'answer', 'answer': answer }) }, MemberId);
};

let addAnswer = async (answer) => {
    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer);
    }
};

let leaveChannel = async () => {
    await channel.leave();
    await client.logout();
    // Stop speech recognition when leaving the channel
    speechRecognition.stop();
};

let toggleCamera = async () => {
    let videoTrack = localStream.getTracks().find((track) => track.kind === 'video');

    if (videoTrack.enabled) {
        videoTrack.enabled = false;
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)';
    } else {
        videoTrack.enabled = true;
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)';
    }
};

let toggleMic = async () => {
    let audioTrack = localStream.getTracks().find((track) => track.kind === 'audio');

    if (audioTrack.enabled) {
        audioTrack.enabled = false;
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)';
        // Stop speech recognition when the microphone is muted
        if (speechRecognition) {
            speechRecognition.stop();
        }
    } else {
        audioTrack.enabled = true;
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)';
        // Start speech recognition when the microphone is unmuted
        if (localStream) {
            startSpeechRecognition(localStream);
        }
    }
};
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', leaveChannel);
}

document.getElementById('camera-btn').addEventListener('click', toggleCamera);
document.getElementById('mic-btn').addEventListener('click', toggleMic);

init();

// Function to start speech recognition
let startSpeechRecognition = (stream) => {
    speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.interimResults = true;

    // Pass the stream to the recognition instance
    speechRecognition.mediaStream = stream;

    speechRecognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        // Display subtitles
        if (transcript.includes('.')) {
            // If yes, append the current sentence to the chat box and reset it
            appendToChat(currentSentence);
            currentSentence = '';
        }

        currentSentence += transcript;

            // Display subtitles
            subtitlesElement.innerText = currentSentence;

            // Send the transcript to the peer
            sendMessageToPeer({ 'type': 'subtitles', 'subtitles': currentSentence });
    };
    speechRecognition.onend = () => {
        // Restart speech recognition when it ends
        startSpeechRecognition(stream);
    };
if(stream)
    speechRecognition.start();
};

let appendToChat = (sentence) => {
    if (sentence.trim() !== '') {
        let chatBox = document.getElementById('subtitles-container');
        let sentenceElement = document.createElement('div');
        sentenceElement.innerText = sentence.trim();
        chatBox.appendChild(sentenceElement);
    }
};
// Function to handle subtitles from the peer
let handleSubtitlesFromPeer = (subtitles) => {
    // Display subtitles on the remote video feed
    subtitlesElement.innerText = subtitles;
};
