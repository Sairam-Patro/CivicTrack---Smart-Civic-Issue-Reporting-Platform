import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../context/AdminAuthContext';

let socketInstance = null;

export const useAdminSocket = (onEventReceived = null) => {
  const { admin, token } = useAdminAuth();
  const [connected, setConnected] = useState(false);
  const [latestEvent, setLatestEvent] = useState(null);

  useEffect(() => {
    if (!admin || !token) {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
      setConnected(false);
      return;
    }

    if (!socketInstance) {
      const socketUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : window.location.origin;

      socketInstance = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketInstance.on('connect', () => {
        setConnected(true);
        // Join geographic & role room
        if (admin.role === 'super_admin') {
          socketInstance.emit('join_room', 'national');
        } else if (admin.state) {
          socketInstance.emit('join_room', `state:${admin.state}`);
        }
      });

      socketInstance.on('disconnect', () => {
        setConnected(false);
      });

      // Real-time events
      socketInstance.on('issue:updated', (data) => {
        setLatestEvent({ type: 'issue:updated', data, time: new Date() });
        if (onEventReceived) onEventReceived('issue:updated', data);
      });

      socketInstance.on('issue:status-changed', (data) => {
        toast(`Issue ${data.issueCode} updated to ${data.status}`, {
          icon: '🔄',
          style: { borderRadius: '10px', background: '#102544', color: '#fff' },
        });
        setLatestEvent({ type: 'issue:status-changed', data, time: new Date() });
        if (onEventReceived) onEventReceived('issue:status-changed', data);
      });

      socketInstance.on('issue:assigned', (data) => {
        toast(`Issue ${data.issueCode} assigned to ${data.officer || data.department}`, {
          icon: '📋',
          style: { borderRadius: '10px', background: '#102544', color: '#fff' },
        });
        setLatestEvent({ type: 'issue:assigned', data, time: new Date() });
        if (onEventReceived) onEventReceived('issue:assigned', data);
      });

      socketInstance.on('issue:escalated', (data) => {
        toast.error(`ALERT: Issue ${data.issueCode} Escalated! (${data.reason})`, {
          duration: 5000,
        });
        setLatestEvent({ type: 'issue:escalated', data, time: new Date() });
        if (onEventReceived) onEventReceived('issue:escalated', data);
      });

      socketInstance.on('issue:resolved', (data) => {
        toast.success(`Issue ${data.issueCode} marked as RESOLVED!`, {
          duration: 4000,
        });
        setLatestEvent({ type: 'issue:resolved', data, time: new Date() });
        if (onEventReceived) onEventReceived('issue:resolved', data);
      });

      socketInstance.on('notification:new', (data) => {
        toast(`Announcement: ${data.title}`, {
          icon: '📢',
          style: { borderRadius: '10px', background: '#07845F', color: '#fff' },
        });
        setLatestEvent({ type: 'notification:new', data, time: new Date() });
        if (onEventReceived) onEventReceived('notification:new', data);
      });
    }

    return () => {
      // Keep socket alive across pages for live notifications
    };
  }, [admin, token, onEventReceived]);

  return { connected, latestEvent, socket: socketInstance };
};

export default useAdminSocket;
