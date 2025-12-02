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
  
  // Helpers to keep selected ids consistent and unique
  const toStringId = (val: unknown) =>
    typeof val === "string"
      ? val
      : typeof (val as any)?._id === "string"
      ? (val as any)._id
      : typeof (val as any)?.id === "string"
      ? (val as any).id
      : undefined;

  const setSelectedUnique = (ids: Array<string | undefined>) => {
    const cleaned = ids.filter((x): x is string => !!x);
    const unique = Array.from(new Set(cleaned));
    setSelectedTemplateIds(unique);
  };

  const toggleTemplateId = (id: string) => {
    setSelectedTemplateIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      return Array.from(new Set(next));
    });
  };

  const selectTemplateId = (id: string) => {
    setSelectedTemplateIds((prev) => Array.from(new Set([...prev, id])));
  };

  const deselectTemplateId = (id: string) => {
    setSelectedTemplateIds((prev) => prev.filter((x) => x !== id));
  };

  // Replace the whole selected list (e.g., from Active Templates UI)
  const setActiveTemplates = (ids: string[]) => {
    setSelectedUnique(ids.map((x) => toStringId(x)));
  };

  // Derived list of active template entities based on selected ids
  const activeTemplates: WorkoutTemplate[] = templates.filter((t) => {
    const id = toStringId(t);
    return id ? selectedTemplateIds.includes(id) : false;
  });

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
        // Cập nhật form state ngay khi load xong để đảm bảo đồng bộ
        setName(scheduleRes.name);
        setType(scheduleRes.type || "");
        setReplay(scheduleRes.replay?.toString() || "1");

        if (Array.isArray(scheduleRes.templates)) {
          const ids = scheduleRes.templates.map((t: any) =>
            typeof t === "string" ? t : t?.id || t?._id || undefined
          );
          setSelectedUnique(ids);
        } else {
          setSelectedTemplateIds([]);
        }
      }
    } catch (err: any) {
       // ... giữ nguyên
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openModal = () => {
    if (schedule) {
      setName(schedule.name);
      setType(schedule.type || "");
      setReplay(schedule.replay?.toString() || "1");
      if (Array.isArray(schedule.templates)) {
        const ids = schedule.templates.map((t: any) =>
          typeof t === "string" ? t : t?.id || t?._id || undefined
        );
        setSelectedUnique(ids);
      } else {
        setSelectedTemplateIds([]);
      }
    } else {
      // Nếu tạo mới
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
      // Always send clean, unique, string ids
      templates: Array.from(new Set(selectedTemplateIds.map(String))),
    };
    console.log("form---",payload);
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
    activeTemplates,
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
    selectTemplateId,
    deselectTemplateId,
    setActiveTemplates,

    reload: loadData,
    handleSave,
  };
}
