// Real-time Notification Service
class NotificationService {
  constructor() {
    this.permission = 'default';
    this.isSupported = 'Notification' in window;
    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.log('Browser notifications not supported');
      return;
    }
    
    this.permission = Notification.permission;
    
    // Auto-request permission if not yet decided
    if (this.permission === 'default') {
      await this.requestPermission();
    }
  }

  async requestPermission() {
    if (!this.isSupported) return false;
    
    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  canShowNotifications() {
    return this.isSupported && this.permission === 'granted';
  }

  showNotification(title, options = {}) {
    if (!this.canShowNotifications()) {
      console.log('Notifications not permitted or supported - using fallback');
      
      // Beautiful fallback with custom styling
      this.showCustomAlert(title, options.body || '');
      return null;
    }

    const defaultOptions = {
      icon: this.getNotificationIcon(options.type),
      badge: '/vite.svg',
      dir: 'ltr',
      lang: 'nl',
      renotify: true,
      requireInteraction: false,
      silent: false,
      tag: options.tag || 'lease-crm',
      timestamp: Date.now(),
      vibrate: this.getVibrationPattern(options.type),
      actions: this.getNotificationActions(options.type),
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const notification = new Notification(title, finalOptions);
      
      // Play notification sound
      this.playNotificationSound(options.type);
      
      // Auto-close after duration based on type
      const duration = options.type === 'high-value' ? 12000 : 8000;
      setTimeout(() => {
        if (notification) {
          notification.close();
        }
      }, duration);

      // Add click handler
      notification.onclick = () => {
        window.focus();
        notification.close();
        // Could navigate to specific CRM entry here
      };

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      
      // Beautiful fallback on error
      this.showCustomAlert(title, options.body || '');
      return null;
    }
  }

  // Get icon based on notification type
  getNotificationIcon(type) {
    const iconMap = {
      'new-request': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMzYjgyZjYiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xOSAzSDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnptLTUgMTRIN3YtMmg3djJ6bTMtNEg3di0yaDEwdjJ6bTAtNEg3VjdoMTB2MnoiLz4KPC9zdmc+Cjwvc3ZnPgo=',
      'high-value': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNmNTk3MzEiLz4KPHN2ZyB4PSIxNCIgeT0iMTQiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHptLjMxLThoLjE0Yy4wNSAwIC4xLS4wMS4xNC0uMDEuNDYtLjA0LjguNDYuNzguOTMtLjAyLjQ1LS4zNC44My0uNzkuODctLjQ0LjAzLS44Mi0uMzMtLjg2LS43N2wtLjAzLS4yOGMwLS4wNS4wMS0uMS4wMS0uMTQuMDItLjQ3LjM4LS44MS44Ni0uODNoLjM3em0tLjMxLTNjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXoiLz4KPC9zdmc+Cjwvc3ZnPgo=',
      'test': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMxMGI5ODEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik05IDE2LjE3TDQuODMgMTJsLTEuNDIgMS40MUw5IDIwIDIxIDhsLTEuNDEtMS40MXoiLz4KPC9zdmc+Cjwvc3ZnPgo='
    };
    
    return iconMap[type] || iconMap['new-request'];
  }

  // Get vibration pattern based on type
  getVibrationPattern(type) {
    const patterns = {
      'new-request': [200, 100, 200],
      'high-value': [300, 100, 300, 100, 300],
      'test': [100, 50, 100]
    };
    
    return patterns[type] || patterns['new-request'];
  }

  // Get notification actions based on type
  getNotificationActions(type) {
    if (type === 'high-value') {
      return [
        { action: 'view', title: '👀 Bekijk nu', icon: '/icons/view.png' },
        { action: 'call', title: '📞 Bel klant', icon: '/icons/call.png' }
      ];
    } else if (type === 'new-request') {
      return [
        { action: 'view', title: '📋 Bekijk aanvraag', icon: '/icons/view.png' },
        { action: 'later', title: '⏰ Later', icon: '/icons/later.png' }
      ];
    }
    
    return [];
  }

  // Play sound based on notification type
  playNotificationSound(type) {
    try {
      let soundData;
      
      if (type === 'high-value') {
        // High-value request sound (more attention-grabbing)
        soundData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D0r2AfBTGH0fPTgjMGK37O7+CVPO0NVq3n77BdGAg+ltryxnkpBSl+zPLaizsIGGS57OihUgwUVKrj8bllHgg2jdXzzn0vBSF1xe/dkTwIHVu16OWiUQwORJzd8bJjHAU2jdXzzn0vBSN2xe/dkTsKGGS76OWnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGO76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkTsJGGS76OWnUgwTPJzd8rJjHAU2jdXzzn0vBSJ2xe/dkjsJGGO76OSnUgwURJzd8bJjHAU2jdXzzn0vBSN2xe/dkTsJGGS76OWnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGO76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJ';
      } else {
        // Regular notification sound
        soundData = 'data:audio/wav;base64,UklGRvoBAABXQVZFZm10IBAAAAABAAEAiBcAAIgXAAABAAgAZGF0YdYBAAC2tbSytri3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4uLa3t7q5uLi2t7e6ubi4tre3urm4';
      }
      
      const audio = new Audio(soundData);
      audio.volume = type === 'high-value' ? 0.6 : 0.3;
      audio.play().catch(() => {}); // Ignore errors
    } catch (e) {
      // Ignore audio errors
    }
  }

  // Beautiful custom alert as fallback
  showCustomAlert(title, body) {
    // Create custom styled alert overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    `;

    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
      background: white;
      border-radius: 16px;
      padding: 24px;
      max-width: 400px;
      margin: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
      border: 1px solid #e5e7eb;
    `;

    alertBox.innerHTML = `
      <style>
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      </style>
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <div style="width: 48px; height: 48px; background: #3b82f6; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          <span style="color: white; font-size: 24px;">🚗</span>
        </div>
        <div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">${title}</h3>
        </div>
      </div>
      <p style="margin: 0 0 20px 0; color: #6b7280; line-height: 1.5;">${body}</p>
      <div style="display: flex; justify-content: flex-end;">
        <button id="customAlertOk" style="
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        ">OK</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add click handlers
    const okButton = alertBox.querySelector('#customAlertOk');
    const closeAlert = () => {
      overlay.style.animation = 'fadeOut 0.2s ease-in';
      setTimeout(() => document.body.removeChild(overlay), 200);
    };

    okButton.onclick = closeAlert;
    overlay.onclick = (e) => {
      if (e.target === overlay) closeAlert();
    };

    // Auto-close after 8 seconds
    setTimeout(closeAlert, 8000);
  }

  // Specific notification types for the lease CRM
  newLeaseRequest(customerName, leaseType, amount) {
    const title = '🚗 Nieuwe lease aanvraag!';
    const body = `${customerName} heeft een ${leaseType} aangevraagd${amount ? ` voor €${amount.toLocaleString('nl-NL')}/mnd` : ''}`;
    
    return this.showNotification(title, {
      body,
      type: 'new-request',
      tag: 'new-lease-request'
    });
  }

  urgentLeaseRequest(customerName, reason) {
    const title = '🔥 Urgente aanvraag!';
    const body = `${customerName}: ${reason}`;
    
    return this.showNotification(title, {
      body,
      icon: '🔥',
      requireInteraction: true,
      actions: [
        { action: 'urgent_view', title: 'Direct bekijken' }
      ],
      data: {
        type: 'urgent_lease_request',
        customerName,
        reason,
        timestamp: new Date().toISOString()
      }
    });
  }

  highValueRequest(customerName, amount) {
    const title = '💎 Premium Aanvraag!';
    const body = `${customerName} heeft een high-value aanvraag gedaan voor €${amount.toLocaleString('nl-NL')} per maand! 🎯`;
    
    return this.showNotification(title, {
      body,
      type: 'high-value',
      tag: 'high-value-request'
    });
  }

  // Handle notification clicks
  setupNotificationHandlers() {
    if (!this.isSupported) return;

    // Handle notification clicks
    navigator.serviceWorker?.addEventListener('notificationclick', (event) => {
      event.notification.close();
      
      const data = event.notification.data;
      const action = event.action;

      // Open CRM window or focus existing window
      const urlToOpen = '/crm';
      
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
          .then((clientList) => {
            // Check if CRM is already open
            for (const client of clientList) {
              if (client.url.includes('/crm') && 'focus' in client) {
                return client.focus();
              }
            }
            
            // Open new CRM window
            if (clients.openWindow) {
              return clients.openWindow(urlToOpen);
            }
          })
      );
    });
  }

  // Test notification function with debugging
  async testNotification() {
    console.log('🧪 Testing notification...');
    console.log('Supported:', this.isSupported);
    console.log('Permission:', this.permission);
    
    if (!this.isSupported) {
      alert('❌ Browser ondersteunt geen notifications');
      return false;
    }
    
    if (this.permission === 'denied') {
      alert('❌ Notifications zijn geblokkeerd. Ga naar browser instellingen om toe te staan.');
      return false;
    }
    
    if (this.permission === 'default') {
      console.log('🔔 Requesting permission...');
      const granted = await this.requestPermission();
      if (!granted) {
        alert('❌ Notification permission geweigerd');
        return false;
      }
    }
    
    console.log('✅ Showing test notification...');
    
    // Show a beautiful test notification
    const title = '🧪 Test Notificatie';
    const body = 'Dit is een test van het notification systeem. Alles werkt perfect! ✨';
    const notification = this.showNotification(title, {
      body,
      type: 'test',
      tag: 'test-notification'
    });
    
    if (notification) {
      console.log('✅ Test notification created successfully');
      alert('✅ Test notification verstuurd! Check je browser notifications.');
      return true;
    } else {
      console.error('❌ Failed to create notification');
      alert('❌ Test notification mislukt. Check console voor details.');
      return false;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
