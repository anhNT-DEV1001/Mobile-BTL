import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSchedule } from "../hooks/useSchedule";
import { FAB } from "react-native-paper";
import { usePushNotifications } from "@/src/common/hooks/useNotification";
import {
  createUserNotification,
  createRepeatNotificationJob,
  deleteAllRepeatNotificationJobs,
  getUserNotification,
  updateUserNotification,
  UserNotificationConfig,
} from "../services/notification.service";

export default function Schedule() {
  const {
    schedule,
    templates,
    loading,
    saving,
    error,
    modalVisible,
    openModal,
    closeModal,
    name,
    setName,
    type,
    setType,
    replay,
    setReplay,
    selectedTemplateIds,
    setSelectedTemplateIds,
    toggleTemplateId,
    setActiveTemplates,
    activeTemplates,
    handleSave,
  } = useSchedule();

  const { expoPushToken } = usePushNotifications();

  const [notiModalVisible, setNotiModalVisible] = useState(false);
  const [notiConfig, setNotiConfig] = useState<UserNotificationConfig | null>(null);
  const [notiDays, setNotiDays] = useState<number[]>([1, 3, 5]);
  const [notiHour, setNotiHour] = useState<string>("21");
  const [notiMinute, setNotiMinute] = useState<string>("00");
  const [notiSaving, setNotiSaving] = useState(false);
  const [notiError, setNotiError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotification = async () => {
      try {
        const res = await getUserNotification();
        if (res) {
          setNotiConfig(res);
          setNotiDays(res.days || [1, 3, 5]);
          if (res.time && /^\d{2}:\d{2}$/.test(res.time)) {
            const [h, m] = res.time.split(":");
            setNotiHour(h);
            setNotiMinute(m);
          }
        }
      } catch (e) {
        // bỏ qua lỗi, chỉ coi như chưa có cấu hình
      }
    };
    loadNotification();
  }, []);

  const toggleDay = (day: number) => {
    setNotiDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const openNotiModal = () => {
    setNotiError(null);
    setNotiModalVisible(true);
  };

  const closeNotiModal = () => {
    setNotiModalVisible(false);
  };

  const handleSaveNotification = async () => {
    if (!schedule) {
      setNotiError("Bạn cần tạo Schedule trước khi lập lịch thông báo.");
      return;
    }
    if (!expoPushToken) {
      setNotiError("Không lấy được Expo Push Token. Vui lòng kiểm tra quyền thông báo.");
      return;
    }
    if (!notiDays.length) {
      setNotiError("Vui lòng chọn ít nhất một ngày trong tuần.");
      return;
    }
    const h = Number(notiHour);
    const m = Number(notiMinute);
    if (
      Number.isNaN(h) ||
      Number.isNaN(m) ||
      h < 0 ||
      h > 23 ||
      m < 0 ||
      m > 59
    ) {
      setNotiError("Giờ phải hợp lệ (HH:mm).");
      return;
    }
    const time = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;

    const body = {
      expoToken: expoPushToken,
      delay: 0,
      schedule: schedule.id,
      days: notiDays,
      time,
    };

    setNotiSaving(true);
    setNotiError(null);
    try {
      const res = notiConfig
        ? await updateUserNotification(body)
        : await createUserNotification(body);
      setNotiConfig(res);
      // Sau khi lưu cấu hình notification, tự động tạo/cập nhật job repeat trên server
      try {
        const repeatRes = await createRepeatNotificationJob(schedule.id);
        console.log("[Notification] /notification/repeat response:", repeatRes);
      } catch (repeatErr) {
        console.log("[Notification] Gọi /notification/repeat thất bại:", repeatErr);
      }
      setNotiModalVisible(false);
    } catch (err: any) {
      setNotiError(err?.message || "Không thể lưu cấu hình thông báo");
    } finally {
      setNotiSaving(false);
    }
  };

  const handleCancelNotification = async () => {
    setNotiSaving(true);
    setNotiError(null);
    try {
      const res = await deleteAllRepeatNotificationJobs();
      console.log("[Notification] /notification/repeat/all DELETE response:", res);
      setNotiModalVisible(false);
    } catch (err: any) {
      setNotiError(err?.message || "Không thể hủy lịch thông báo");
    } finally {
      setNotiSaving(false);
    }
  };

  const handleToggleTemplate = (tplId: string, tplName: string) => {
    const isSelected = selectedTemplateIds.includes(tplId);
    const nextIds = isSelected
      ? selectedTemplateIds.filter((id) => id !== tplId)
      : Array.from(new Set([...selectedTemplateIds, tplId]));

    // Update via helper to ensure dedupe and normalized ids
    setActiveTemplates(nextIds);

    console.log(
      `[Event] ${isSelected ? "Đã bỏ" : "Đã active"} template: "${tplName}"`
    );
    console.log("Danh sách Active Templates hiện tại:", nextIds);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      ) : (
        <View style={styles.content}> 
          {schedule ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{schedule.name}</Text>
              {schedule.type ? (
                <Text style={styles.cardText}>Type: {schedule.type}</Text>
              ) : null}
              {typeof schedule.replay !== "undefined" ? (
                <Text style={styles.cardText}>Replay: {schedule.replay}</Text>
              ) : null}
              <Text style={styles.cardSubTitle}>Templates:</Text>
              <Text style={styles.cardText}>
                {Array.isArray(schedule.templates)
                  ? schedule.templates
                      .map((t: any) => t?.name || t?.id || "Template")
                      .join(", ")
                  : "N/A"}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Bạn chưa có schedule. Hãy tạo mới để bắt đầu luyện tập định kỳ.
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.addButton} onPress={openModal}>
            <Text style={styles.addButtonText}>
              {schedule ? "Cập nhật Schedule" : "Thêm Schedule"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {schedule ? "Cập nhật Schedule" : "Tạo Schedule mới"}
            </Text>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <ScrollView style={{ maxHeight: 320 }}>
              <Text style={styles.label}>Tên lịch tập *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: Lịch tập tuần"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Loại (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: bulking, cutting..."
                value={type}
                onChangeText={setType}
              />

              <Text style={styles.label}>Số lần lặp / tuần (optional)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="1"
                value={replay}
                onChangeText={setReplay}
              />

              <Text style={styles.label}>Chọn Workout Template *</Text>
              <View style={styles.templateList}>
                {templates.map((tpl: any) => {
                  const tplId = tpl.id || tpl._id;
                  const isSelected = selectedTemplateIds.includes(tplId);
                  return (
                    <TouchableOpacity
                      key={tplId} 
                      style={[
                        styles.templateItem,
                        isSelected && styles.templateItemActive,
                      ]}
                      onPress={() => handleToggleTemplate(tplId, tpl.name)}
                    >
                      <Text
                        style={[
                          styles.templateItemText,
                          isSelected && styles.templateItemTextActive,
                        ]}
                      >
                        {tpl.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {templates.length === 0 && (
                  <Text style={styles.emptyText}>
                    Bạn chưa có template nào. Hãy tạo template trước.
                  </Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={saving} 
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Lưu</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button cho Notification */}
      <FAB
        icon="bell"
        style={styles.fab}
        color="#fff"
        onPress={openNotiModal}
      />

      {/* Modal cấu hình Notification */}
      <Modal
        visible={notiModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeNotiModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {notiConfig ? "Cập nhật lịch thông báo" : "Tạo lịch thông báo"}
            </Text>

            {!!notiError && <Text style={styles.errorText}>{notiError}</Text>}

            <ScrollView style={{ maxHeight: 320 }}>
              <Text style={styles.label}>Chọn ngày trong tuần *</Text>
              <View style={styles.dayRow}>
                {[
                  { label: "CN", value: 0 },
                  { label: "T2", value: 1 },
                  { label: "T3", value: 2 },
                  { label: "T4", value: 3 },
                  { label: "T5", value: 4 },
                  { label: "T6", value: 5 },
                  { label: "T7", value: 6 },
                ].map((d) => (
                  <TouchableOpacity
                    key={d.value}
                    style={[
                      styles.dayChip,
                      notiDays.includes(d.value) && styles.dayChipActive,
                    ]}
                    onPress={() => toggleDay(d.value)}
                  >
                    <Text
                      style={[
                        styles.dayChipText,
                        notiDays.includes(d.value) && styles.dayChipTextActive,
                      ]}
                    >
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Giờ gửi thông báo (HH:mm) *</Text>
              <View style={styles.timeRow}>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  keyboardType="numeric"
                  placeholder="HH"
                  maxLength={2}
                  value={notiHour}
                  onChangeText={setNotiHour}
                />
                <Text style={{ marginHorizontal: 4, fontSize: 16 }}>:</Text>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  keyboardType="numeric"
                  placeholder="MM"
                  maxLength={2}
                  value={notiMinute}
                  onChangeText={setNotiMinute}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeNotiModal}>
                <Text style={styles.cancelButtonText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelJobButton}
                onPress={handleCancelNotification}
                disabled={notiSaving}
              >
                <Text style={styles.cancelJobButtonText}>Hủy thông báo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveNotification}
                disabled={notiSaving}
              >
                {notiSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Lưu</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#003366",
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  cardSubTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    color: "#555",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
  },
  addButton: {
    backgroundColor: "#003366",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#003366",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  templateList: {
    marginTop: 4,
  },
  templateItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  templateItemActive: {
    borderColor: "#003366",
    backgroundColor: "#e3f2fd",
  },
  templateItemText: {
    fontSize: 14,
    color: "#333",
  },
  templateItemTextActive: {
    color: "#003366",
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#555",
    fontWeight: "600",
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#003366",
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  errorText: {
    color: "red",
    marginBottom: 4,
    fontSize: 12,
  },
  cancelJobButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f44336",
    borderRadius: 8,
    marginRight: 8,
  },
  cancelJobButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    backgroundColor: "#ff9800",
  },
  dayRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  dayChipActive: {
    borderColor: "#ff9800",
    backgroundColor: "#fff3e0",
  },
  dayChipText: {
    fontSize: 12,
    color: "#333",
  },
  dayChipTextActive: {
    color: "#ff9800",
    fontWeight: "700",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeInput: {
    width: 60,
    textAlign: "center",
  },
});

