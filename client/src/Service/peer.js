class PeerService {
  constructor() {
    if (!PeerService.instance) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

      PeerService.instance = this;
    }

    return PeerService.instance;
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  async setLocalDescription(description) {
    if (this.peer) {
      await this.peer.setLocalDescription(new RTCSessionDescription(description));
    }
  }

  async setRemoteDescription(description) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(description));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  async addIceCandidate(candidate) {
    if (this.peer) {
      await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }
}

const peerServiceInstance = new PeerService();

export default peerServiceInstance;
