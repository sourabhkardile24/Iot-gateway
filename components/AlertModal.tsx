import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Alert, useAlert } from '../contexts/AlertContext';

const { width, height } = Dimensions.get('window');

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  alert?: Alert;
}

export function AlertModal({ visible, onClose, alert }: AlertModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { dismissAlert, stopContinuousSound } = useAlert();

  if (!alert) return null;

  const handleDismiss = async () => {
    dismissAlert(alert.id);
    onClose();
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'warning';
    }
  };

  const getAlertColors = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return {
          gradient: ['#fee2e2', '#fecaca', '#fca5a5'] as const,
          icon: '#dc2626',
          border: '#f87171'
        };
      case 'warning':
        return {
          gradient: ['#fef3c7', '#fde68a', '#facc15'] as const,
          icon: '#d97706',
          border: '#f59e0b'
        };
      case 'info':
        return {
          gradient: ['#dbeafe', '#bfdbfe', '#93c5fd'] as const,
          icon: '#2563eb',
          border: '#3b82f6'
        };
      default:
        return {
          gradient: ['#fef3c7', '#fde68a', '#facc15'] as const,
          icon: '#d97706',
          border: '#f59e0b'
        };
    }
  };

  const colors = getAlertColors(alert.type);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.modal, { borderColor: colors.border }]}
          >
            {/* Header with icon and close button */}
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: colors.icon }]}>
                <Ionicons
                  name={getAlertIcon(alert.type)}
                  size={32}
                  color="white"
                />
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Alert content */}
            <View style={styles.content}>
              <Text style={styles.title}>{alert.title}</Text>
              <Text style={styles.message}>{alert.message}</Text>
              
              <View style={styles.timestampContainer}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.timestamp}>
                  {alert.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.dismissButton]}
                onPress={handleDismiss}
              >
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface AlertListModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AlertListModal({ visible, onClose }: AlertListModalProps) {
  const { alerts, dismissAlert, clearAllAlerts, stopContinuousSound } = useAlert();
  const colorScheme = useColorScheme() ?? 'light';

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'warning';
    }
  };

  const getAlertIconColor = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return '#dc2626';
      case 'warning':
        return '#d97706';
      case 'info':
        return '#2563eb';
      default:
        return '#d97706';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.listModalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.listModal, colorScheme === 'dark' && styles.listModalDark]}>
            {/* Header */}
            <View style={styles.listHeader}>
              <Text style={[styles.listTitle, colorScheme === 'dark' && styles.listTitleDark]}>
                Active Alerts ({activeAlerts.length})
              </Text>
              <View style={styles.listHeaderActions}>
                {activeAlerts.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearAllButton}
                    onPress={clearAllAlerts}
                  >
                    <Text style={styles.clearAllButtonText}>Clear All</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Alert list */}
            <View style={styles.alertList}>
              {activeAlerts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
                  <Text style={[styles.emptyStateText, colorScheme === 'dark' && styles.emptyStateTextDark]}>
                    No active alerts
                  </Text>
                </View>
              ) : (
                activeAlerts.map((alert) => (
                  <View key={alert.id} style={[styles.alertItem, colorScheme === 'dark' && styles.alertItemDark]}>
                    <View style={styles.alertItemHeader}>
                      <Ionicons
                        name={getAlertIcon(alert.type)}
                        size={20}
                        color={getAlertIconColor(alert.type)}
                      />
                      <Text style={[styles.alertItemTitle, colorScheme === 'dark' && styles.alertItemTitleDark]}>
                        {alert.title}
                      </Text>
                      <TouchableOpacity
                        style={styles.dismissButton}
                        onPress={() => dismissAlert(alert.id)}
                      >
                        <Ionicons name="close-circle" size={20} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.alertItemMessage, colorScheme === 'dark' && styles.alertItemMessageDark]}>
                      {alert.message}
                    </Text>
                    <Text style={[styles.alertItemTime, colorScheme === 'dark' && styles.alertItemTimeDark]}>
                      {alert.timestamp.toLocaleString()}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  timestampContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  dismissButton: {
    backgroundColor: '#6b7280',
  },
  dismissButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },

  // Alert List Modal Styles
  listModalContainer: {
    width: width * 0.95,
    height: height * 0.8,
    marginTop: height * 0.1,
  },
  listModal: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
  },
  listModalDark: {
    backgroundColor: '#1f2937',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  listHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  listTitleDark: {
    color: '#f9fafb',
  },
  clearAllButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearAllButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  alertList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyStateTextDark: {
    color: '#9ca3af',
  },
  alertItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d97706',
  },
  alertItemDark: {
    backgroundColor: '#374151',
  },
  alertItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  alertItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  alertItemTitleDark: {
    color: '#f9fafb',
  },
  alertItemMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  alertItemMessageDark: {
    color: '#d1d5db',
  },
  alertItemTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  alertItemTimeDark: {
    color: '#9ca3af',
  },
});