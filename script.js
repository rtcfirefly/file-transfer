document.addEventListener('DOMContentLoaded', function () {
    let pc = new RTCPeerConnection();
    let dc = pc.createDataChannel('fileChannel');
    let fileInput = document.getElementById('fileInput');

    document.getElementById('createOffer').addEventListener('click', async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        document.getElementById('offer').value = JSON.stringify(offer);
    });

    document.getElementById('setAnswer').addEventListener('click', () => {
        const answer = JSON.parse(document.getElementById('answer').value);
        pc.setRemoteDescription(answer);
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        sendFile(file);
    });

    function sendFile(file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = reader.result;
            dc.send(buffer);
        };
    }

    dc.addEventListener('message', event => {
        const buffer = event.data;
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        window.location = url;
    });
});
