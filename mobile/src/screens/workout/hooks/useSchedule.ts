import { useCallback, useEffect, useState } from "react";
import {
  CreateOrUpdateScheduleDto,
  Schedule,
  createSchedule,
  getUserSchedule,
  updateSchedule,
} from "../services/schedule.service";
import { getWorkoutTemplates, WorkoutTemplate } from "../services/workout.service";

export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [replay, setReplay] = useState<string>("1");
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [scheduleRes, templatesRes] = await Promise.all([
        getUserSchedule(),
        getWorkoutTemplates(),
      ]);
      setSchedule(scheduleRes);
      setTemplates(templatesRes);

      if (scheduleRes) {
        setName(scheduleRes.name);
        setType(scheduleRes.type || "");
        setReplay(scheduleRes.replay?.toString() || "1");
        // Nếu BE trả templates là mảng, map ra danh sách id
        if (Array.isArray(scheduleRes.templates)) {
          const ids = scheduleRes.templates
            .map((t: any) =>
              typeof t === "string"
                ? t
                : t?.id || t?._id || null
            )
            .filter((id: string | null) => !!id) as string[];
          setSelectedTemplateIds(ids);
        }
      }
    } catch (err: any) {
      if (err?.statusCode !== 400) {
        setError(err?.message || "Có lỗi xảy ra khi tải lịch tập");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openModal = () => {
    if (!schedule) {
      // nếu chưa có schedule, reset form
      setName("");
      setType("");
      setReplay("1");
      setSelectedTemplateIds([]);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!selectedTemplateIds.length) {
      setError("Vui lòng chọn ít nhất một workout template");
      return;
    }
    if (!name.trim()) {
      setError("Vui lòng nhập tên lịch tập");
      return;
    }

    const payload: CreateOrUpdateScheduleDto = {
      name: name.trim(),
      type: type.trim() || undefined,
      replay: replay ? Number(replay) : undefined,
      templates: selectedTemplateIds,
    };

    setSaving(true);
    setError(null);
    try {
      if (schedule) {
        await updateSchedule(payload);
      } else {
        await createSchedule(payload);
      }
      // Sau khi lưu, reload lại từ server để đảm bảo dữ liệu (đặc biệt templates) đầy đủ & populate
      await loadData();
      setModalVisible(false);
    } catch (err: any) {
      setError(err?.message || "Không thể lưu lịch tập");
    } finally {
      setSaving(false);
    }
  };

  return {
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

    reload: loadData,
    handleSave,
  };
}
