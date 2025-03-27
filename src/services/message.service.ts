import { buildUrl } from '@lib/string';
import { APIRequest } from './api-request';

export class MessageService extends APIRequest {
  getTotalConversationBlocker() {
    return this.get(buildUrl('/purchase-conversation/total'));
  }

  getConversations(query?: Record<string, any>) {
    return this.get(buildUrl('/conversations', query));
  }

  searchConversations(query?: Record<string, any>) {
    return this.get(buildUrl('/conversations/search', query));
  }

  getPurchaseConversations(query?: Record<string, any>) {
    return this.get(buildUrl('/purchase-conversation', query));
  }

  searchPurchaseConversations(query?: Record<string, any>) {
    return this.get(buildUrl('/purchase-conversation/search', query));
  }

  createConversation(data: Record<string, string>) {
    return this.post('/conversations', data);
  }

  blockConversation(id: string) {
    return this.post(`/conversations/block/${id}`);
  }

  getConversationDetail(id: string) {
    return this.get(`/conversations/${id}`);
  }

  getMessages(conversationId: string, query?: Record<string, any>) {
    return this.get(
      buildUrl(`/messages/conversations/${conversationId}`, query)
    );
  }

  getPurchaseMessages(conversationId: string, query?: Record<string, any>) {
    return this.get(
      buildUrl(`/messages/conversations/${conversationId}/purchase`, query)
    );
  }

  sendMessage(conversationId: string, data: Record<string, any>) {
    return this.post(`/messages/conversations/${conversationId}`, data);
  }

  countTotalNotRead(headers?: { [key: string]: string }) {
    return this.get('/messages/counting-not-read-messages', headers);
  }

  readAllInConversation(conversationId: string) {
    return this.post(`/messages/read-all/conversation/${conversationId}`);
  }

  getMessageUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/messages/private/file', endpoint).href;
  }

  getMessageUploadUrlNotUseAntd(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/messages/private/file',
      [
        {
          fieldname: 'message-photo',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  getConversationByStreamId(streamId: string) {
    return this.get(`/conversations/stream/${streamId}`);
  }

  getPublicMessages(conversationId: string, query?: Record<string, any>) {
    return this.get(
      buildUrl(`/messages/conversations/public/${conversationId}`, query)
    );
  }

  sendStreamMessage(conversationId: string, data: Record<string, any>) {
    return this.post(`/messages/stream/conversations/${conversationId}`, data);
  }

  sendPublicStreamMessage(conversationId: string, data: Record<string, any>) {
    return this.post(
      `/messages/stream/public/conversations/${conversationId}`,
      data
    );
  }

  findPublicConversationPerformer(performerId: string) {
    return this.get(`/conversations/stream/public/${performerId}`);
  }

  deleteMessage(id) {
    return this.del(`/messages/${id}`);
  }

  deleteAllMessageInConversation(conversationId) {
    return this.del(`/messages/${conversationId}/remove-all-message`);
  }

  updateConversationName(conversationId, data) {
    return this.put(`/conversations/${conversationId}/update`, data);
  }

  uploadPrivatePhoto(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/messages/private/file/photo',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadPublicPhoto(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/messages/public/file/photo',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadVideo(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/messages/private/file/video',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadTeaser(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/messages/public/file/video',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadPublicThumbnail(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/messages/public/file/thumbnail',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadAudio(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/messages/public/file/audio',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  getTranscodeVideoUrl(messageId: string, fileId: string) {
    return this.post(`/messages/${messageId}/videos/${fileId}/url`);
  }

  getVideoFileStatus(messageId: string, fileId: string) {
    return this.post(`/messages/${messageId}/videos/${fileId}/url`);
  }
}

export const messageService = new MessageService();
