import TrackerListItem from "@/components/health/TrackerListItem";
import TrackerPill from "@/components/health/TrackerPill";
import TrackerSection from "@/components/health/TrackerSection";
import { useUser } from "@/context/UserContext";
import { toDateKey } from "@/services/dateService";
import {
    buildMedicineSchedule,
    createMedicine,
    deleteMedicineById,
    medicineToDateKey,
    saveMedicineTracker,
    subscribeToMedicineTracker,
    toggleDoseTaken,
    upsertMedicine,
    type Medicine,
    type MedicineRecurrence,
} from "@/services/medicineService";
import DateTimePicker, {
    type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    ImageBackground,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const RECURRENCE_OPTIONS: MedicineRecurrence[] = [
  "Once",
  "Daily",
  "Every X days",
  "Custom times per day",
];

type MedicineFormState = {
  name: string;
  dosage: string;
  recurrence: MedicineRecurrence;
  intervalDays: string;
  reminderTimes: string[];
  startDate: string;
  endDate: string;
  notes: string;
};

type PickerTarget = "startDate" | "endDate" | "reminderTime";

function createEmptyFormState(): MedicineFormState {
  return {
    name: "",
    dosage: "",
    recurrence: "Daily",
    intervalDays: "2",
    reminderTimes: [],
    startDate: toDateKey(new Date()),
    endDate: "",
    notes: "",
  };
}

function formatTimeLabel(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const meridiem = hours >= 12 ? "PM" : "AM";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${hours}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

function dateKeyToDate(dateKey: string | null) {
  if (!dateKey) return null;
  const date = new Date(`${dateKey}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function timeLabelToDate(label: string) {
  const match = label
    .trim()
    .toUpperCase()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3];

  if (hours < 1 || hours > 12 || minutes > 59) return null;

  if (hours === 12) hours = 0;
  if (meridiem === "PM") hours += 12;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function normalizeTimeLabel(value: string) {
  const trimmed = value.trim().toUpperCase();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3];

  if (hours < 1 || hours > 12 || minutes > 59) return null;

  if (hours === 12) hours = 0;
  if (meridiem === "PM") hours += 12;

  const displayHours = ((hours + 11) % 12) + 1;
  const displayMeridiem = hours >= 12 ? "PM" : "AM";
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${displayMeridiem}`;
}

export default function MedicineTrackerScreen() {
  const router = useRouter();
  const { firebaseUser } = useUser();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(
    null,
  );
  const [form, setForm] = useState<MedicineFormState>(createEmptyFormState());
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [pickerValue, setPickerValue] = useState<Date>(new Date());
  const [pendingReminderTime, setPendingReminderTime] = useState(
    formatTimeLabel(new Date()),
  );

  useEffect(() => {
    if (!firebaseUser) {
      setMedicines([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const unsubscribe = subscribeToMedicineTracker(
      firebaseUser.uid,
      (tracker) => {
        setMedicines(tracker.medicines);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [firebaseUser]);

  const todayKey = toDateKey(new Date());
  const schedule = useMemo(
    () => buildMedicineSchedule(medicines, todayKey),
    [medicines, todayKey],
  );
  const takenCount = schedule.filter((item) => item.completed).length;
  const adherence =
    schedule.length === 0
      ? 0
      : Math.round((takenCount / schedule.length) * 100);

  const activeMedicines = [...medicines].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  async function persistMedicines(nextMedicines: Medicine[]) {
    if (!firebaseUser) {
      setErrorMessage("Sign in to save medicines to your account.");
      return false;
    }

    const previousMedicines = medicines;
    setMedicines(nextMedicines);
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await saveMedicineTracker(firebaseUser.uid, nextMedicines);
      return true;
    } catch {
      setMedicines(previousMedicines);
      setErrorMessage("Could not save medicine changes right now.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function resetForm() {
    setEditingMedicineId(null);
    setForm(createEmptyFormState());
    setPendingReminderTime(formatTimeLabel(new Date()));
  }

  function startEditingMedicine(medicine: Medicine) {
    setEditingMedicineId(medicine.id);
    setForm({
      name: medicine.name,
      dosage: medicine.dosage,
      recurrence: medicine.recurrence,
      intervalDays: medicine.intervalDays ? String(medicine.intervalDays) : "",
      reminderTimes:
        medicine.reminderTimes.length > 0 ? medicine.reminderTimes : [],
      startDate: medicine.startDateKey,
      endDate: medicine.endDateKey ?? "",
      notes: medicine.notes,
    });
    setPendingReminderTime(
      medicine.reminderTimes[0] ?? formatTimeLabel(new Date()),
    );
  }

  function updateFormField<K extends keyof MedicineFormState>(
    key: K,
    value: MedicineFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openDateOrTimePicker(target: PickerTarget) {
    if (target === "startDate") {
      setPickerValue(dateKeyToDate(form.startDate) ?? new Date());
      setPickerTarget("startDate");
      return;
    }

    if (target === "endDate") {
      setPickerValue(dateKeyToDate(form.endDate) ?? new Date());
      setPickerTarget("endDate");
      return;
    }

    setPickerValue(timeLabelToDate(pendingReminderTime) ?? new Date());
    setPickerTarget("reminderTime");
  }

  function onPickerChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (event.type === "dismissed") {
      setPickerTarget(null);
      return;
    }

    if (!selectedDate || !pickerTarget) {
      if (Platform.OS === "android") {
        setPickerTarget(null);
      }
      return;
    }

    if (pickerTarget === "startDate") {
      updateFormField("startDate", toDateKey(selectedDate));
    } else if (pickerTarget === "endDate") {
      updateFormField("endDate", toDateKey(selectedDate));
    } else {
      setPendingReminderTime(formatTimeLabel(selectedDate));
    }

    setPickerTarget(null);
  }

  function addReminderTime() {
    const normalized = normalizeTimeLabel(pendingReminderTime);
    if (!normalized) {
      setErrorMessage("Pick a valid reminder time.");
      return;
    }

    setErrorMessage(null);
    setForm((current) => ({
      ...current,
      reminderTimes: current.reminderTimes.includes(normalized)
        ? current.reminderTimes
        : [...current.reminderTimes, normalized].sort((a, b) =>
            a.localeCompare(b),
          ),
    }));
  }

  function removeReminderTime(timeLabel: string) {
    setForm((current) => ({
      ...current,
      reminderTimes: current.reminderTimes.filter((time) => time !== timeLabel),
    }));
  }

  async function handleSaveMedicine() {
    const trimmedName = form.name.trim();
    const trimmedDosage = form.dosage.trim();
    const startDateKey = medicineToDateKey(form.startDate) ?? todayKey;
    const endDateKey = form.endDate.trim()
      ? medicineToDateKey(form.endDate)
      : null;
    const reminderTimes = form.reminderTimes;
    const intervalDays =
      form.recurrence === "Every X days" && form.intervalDays.trim()
        ? Number(form.intervalDays)
        : null;
    const derivedFrequency =
      form.recurrence === "Every X days"
        ? `Every ${intervalDays} days`
        : form.recurrence;

    if (!trimmedName || !trimmedDosage) {
      setErrorMessage("Medicine name and dosage are required.");
      return;
    }

    if (reminderTimes.length === 0) {
      setErrorMessage("Add at least one reminder time.");
      return;
    }

    if (
      form.recurrence === "Every X days" &&
      (!intervalDays || intervalDays < 1)
    ) {
      setErrorMessage("Enter a valid interval like 2 for every 2 days.");
      return;
    }

    const previousMedicine = medicines.find(
      (medicine) => medicine.id === editingMedicineId,
    );
    const nextMedicine =
      editingMedicineId && previousMedicine
        ? {
            ...previousMedicine,
            name: trimmedName,
            dosage: trimmedDosage,
            frequency: derivedFrequency,
            recurrence: form.recurrence,
            intervalDays,
            reminderTimes,
            startDateKey,
            endDateKey,
            notes: form.notes.trim(),
          }
        : createMedicine({
            name: trimmedName,
            dosage: trimmedDosage,
            frequency: derivedFrequency,
            recurrence: form.recurrence,
            intervalDays,
            reminderTimes,
            startDateKey,
            endDateKey,
            notes: form.notes.trim(),
          });

    const nextMedicines = editingMedicineId
      ? upsertMedicine(medicines, nextMedicine)
      : [...medicines, nextMedicine];

    const saved = await persistMedicines(nextMedicines);
    if (!saved) return;

    resetForm();
  }

  async function handleDeleteMedicine(medicineId: string) {
    Alert.alert("Delete medicine", "Remove this medicine from your tracker?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const nextMedicines = deleteMedicineById(medicines, medicineId);
          const saved = await persistMedicines(nextMedicines);
          if (saved && editingMedicineId === medicineId) {
            resetForm();
          }
        },
      },
    ]);
  }

  async function handleDosePress(medicine: Medicine, doseKey: string) {
    const nextMedicines = medicines.map((item) =>
      item.id === medicine.id ? toggleDoseTaken(item, doseKey) : item,
    );
    await persistMedicines(nextMedicines);
  }

  return (
    <ImageBackground
      source={require("@/assets/images/onboarding backgroud.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, backgroundColor: "rgba(254, 244, 245, 0.22)" }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 34 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{ paddingTop: 58, paddingHorizontal: 22, paddingBottom: 18 }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={{ marginBottom: 12 }}
            >
              <Text style={{ color: "#C0162C", fontSize: 16 }}>
                ← Medicine Tracker
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "#3A0A12", fontSize: 28, fontWeight: "900" }}>
              Medicine Tracker
            </Text>
            <Text style={{ color: "#9A6070", fontSize: 14, marginTop: 8 }}>
              Save medicines, set doses, and mark each reminder as taken.
            </Text>
            {errorMessage ? (
              <Text style={{ color: "#C0162C", fontSize: 12, marginTop: 10 }}>
                {errorMessage}
              </Text>
            ) : null}
          </View>

          <View style={{ paddingHorizontal: 18 }}>
            <TrackerSection
              title={editingMedicineId ? "Edit Medicine" : "Add New Medicine"}
              icon={editingMedicineId ? "✎" : "➕"}
              subtitle="Cloud-synced and ready for reminders."
            >
              <View style={{ gap: 10 }}>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: "#F4D9DF",
                  }}
                >
                  <TextInput
                    value={form.name}
                    onChangeText={(value) => updateFormField("name", value)}
                    placeholder="Medicine name"
                    placeholderTextColor="#D9A0AC"
                    style={{ color: "#3A0A12", fontSize: 14 }}
                  />
                </View>

                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: "#F4D9DF",
                  }}
                >
                  <TextInput
                    value={form.dosage}
                    onChangeText={(value) => updateFormField("dosage", value)}
                    placeholder="Dosage"
                    placeholderTextColor="#D9A0AC"
                    style={{ color: "#3A0A12", fontSize: 14 }}
                  />
                </View>

                <View>
                  <Text
                    style={{
                      color: "#9A6070",
                      fontSize: 12,
                      fontWeight: "700",
                      marginBottom: 8,
                    }}
                  >
                    Recurrence
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                  >
                    {RECURRENCE_OPTIONS.map((option) => (
                      <TrackerPill
                        key={option}
                        label={option}
                        active={form.recurrence === option}
                        onPress={() => updateFormField("recurrence", option)}
                      />
                    ))}
                  </View>
                </View>

                {form.recurrence === "Every X days" ? (
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: "#F4D9DF",
                    }}
                  >
                    <TextInput
                      value={form.intervalDays}
                      onChangeText={(value) =>
                        updateFormField("intervalDays", value)
                      }
                      placeholder="Interval in days"
                      placeholderTextColor="#D9A0AC"
                      keyboardType="number-pad"
                      style={{ color: "#3A0A12", fontSize: 14 }}
                    />
                  </View>
                ) : null}

                <View>
                  <Text
                    style={{
                      color: "#9A6070",
                      fontSize: 12,
                      fontWeight: "700",
                      marginBottom: 8,
                    }}
                  >
                    Reminder Times
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => openDateOrTimePicker("reminderTime")}
                      style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: 14,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        borderWidth: 1,
                        borderColor: "#F4D9DF",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "#3A0A12", fontSize: 14 }}>
                        {pendingReminderTime}
                      </Text>
                      <Text
                        style={{ color: "#C88A96", fontSize: 11, marginTop: 2 }}
                      >
                        Tap to pick time
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={addReminderTime}
                      style={{
                        backgroundColor: "#FDE8EC",
                        borderRadius: 14,
                        paddingHorizontal: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "#F0C4CC",
                      }}
                    >
                      <Text style={{ color: "#C0162C", fontWeight: "800" }}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 10,
                    }}
                  >
                    {form.reminderTimes.map((slot) => (
                      <TrackerPill
                        key={slot}
                        label={slot}
                        active
                        onPress={() => removeReminderTime(slot)}
                      />
                    ))}
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => openDateOrTimePicker("startDate")}
                    style={{
                      flex: 1,
                      backgroundColor: "#fff",
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: "#F4D9DF",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#3A0A12", fontSize: 14 }}>
                      {form.startDate}
                    </Text>
                    <Text
                      style={{ color: "#C88A96", fontSize: 11, marginTop: 2 }}
                    >
                      Start date
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => openDateOrTimePicker("endDate")}
                    style={{
                      flex: 1,
                      backgroundColor: "#fff",
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: "#F4D9DF",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: form.endDate ? "#3A0A12" : "#D9A0AC",
                        fontSize: 14,
                      }}
                    >
                      {form.endDate || "End date (optional)"}
                    </Text>
                    <Text
                      style={{ color: "#C88A96", fontSize: 11, marginTop: 2 }}
                    >
                      End date
                    </Text>
                  </TouchableOpacity>
                </View>

                {form.endDate ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => updateFormField("endDate", "")}
                    style={{ alignSelf: "flex-start", paddingVertical: 2 }}
                  >
                    <Text
                      style={{
                        color: "#C0162C",
                        fontSize: 12,
                        fontWeight: "700",
                      }}
                    >
                      Clear end date
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: "#F4D9DF",
                  }}
                >
                  <TextInput
                    value={form.notes}
                    onChangeText={(value) => updateFormField("notes", value)}
                    placeholder="Notes"
                    placeholderTextColor="#D9A0AC"
                    multiline
                    style={{
                      color: "#3A0A12",
                      fontSize: 14,
                      minHeight: 72,
                      textAlignVertical: "top",
                    }}
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleSaveMedicine}
                  disabled={isSaving}
                  style={{
                    backgroundColor: isSaving ? "#E4B4BE" : "#C0162C",
                    borderRadius: 18,
                    paddingVertical: 16,
                    alignItems: "center",
                    marginTop: 4,
                    shadowColor: "#C0162C",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.18,
                    shadowRadius: 14,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}
                  >
                    {editingMedicineId ? "Update Medicine" : "Save Medicine"}
                  </Text>
                </TouchableOpacity>

                {editingMedicineId ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={resetForm}
                    style={{ alignItems: "center", paddingVertical: 4 }}
                  >
                    <Text style={{ color: "#C0162C", fontWeight: "700" }}>
                      Cancel edit
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </TrackerSection>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{ color: "#3A0A12", fontSize: 16, fontWeight: "800" }}
              >
                Today’s Schedule
              </Text>
              <Text style={{ color: "#C88A96", fontSize: 12 }}>
                {schedule.length} doses
              </Text>
            </View>

            {isLoading ? (
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#F4D9DF",
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: "#9A6070", fontSize: 13 }}>
                  Loading your medicine tracker...
                </Text>
              </View>
            ) : null}

            {schedule.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#F4D9DF",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{ color: "#3A0A12", fontSize: 14, fontWeight: "800" }}
                >
                  No doses scheduled for today.
                </Text>
                <Text style={{ color: "#9A6070", fontSize: 12, marginTop: 4 }}>
                  Add a medicine or adjust its reminder times to build today’s
                  schedule.
                </Text>
              </View>
            ) : null}

            {schedule.map((item) => {
              const medicine = medicines.find(
                (entry) => entry.id === item.medicineId,
              );

              return (
                <TrackerListItem
                  key={item.id}
                  icon={item.icon}
                  iconBg={item.iconBg}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.completed ? "Taken ✓" : item.actionLabel}
                  accent={item.accent}
                  actionLabel={item.completed ? "Undo" : item.actionLabel}
                  onPress={() => {
                    if (medicine) {
                      void handleDosePress(medicine, item.doseKey);
                    }
                  }}
                />
              );
            })}

            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: "#F4D9DF",
                marginTop: 6,
                marginBottom: 14,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{ color: "#3A0A12", fontSize: 14, fontWeight: "800" }}
                >
                  Medication Adherence
                </Text>
                <Text
                  style={{ color: "#16A34A", fontSize: 12, fontWeight: "700" }}
                >
                  {adherence}%
                </Text>
              </View>
              <View
                style={{
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: "#F5E3E7",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${adherence}%`,
                    height: "100%",
                    backgroundColor: "#16A34A",
                    borderRadius: 999,
                  }}
                />
              </View>
            </View>

            <TrackerSection
              title="Saved Medicines"
              icon="📚"
              subtitle="Tap edit to update an existing medicine or delete it from your list."
            >
              {activeMedicines.length === 0 ? (
                <Text style={{ color: "#9A6070", fontSize: 13 }}>
                  No saved medicines yet.
                </Text>
              ) : null}

              <View style={{ gap: 12 }}>
                {activeMedicines.map((medicine, index) => (
                  <View
                    key={medicine.id}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 18,
                      padding: 14,
                      borderWidth: 1,
                      borderColor: "#F4D9DF",
                      shadowColor: "#C0162C",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.06,
                      shadowRadius: 10,
                      elevation: 2,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 14,
                          backgroundColor:
                            index % 3 === 0
                              ? "#E8F8EF"
                              : index % 3 === 1
                                ? "#FEE8EB"
                                : "#FFF4E5",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 18 }}>💊</Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: "#3A0A12",
                            fontSize: 15,
                            fontWeight: "800",
                          }}
                        >
                          {medicine.name}
                        </Text>
                        <Text
                          style={{
                            color: "#9A6070",
                            fontSize: 12,
                            marginTop: 2,
                          }}
                        >
                          {medicine.dosage}
                          {medicine.frequency ? ` · ${medicine.frequency}` : ""}
                        </Text>
                        <Text
                          style={{
                            color: "#C88A96",
                            fontSize: 11,
                            marginTop: 4,
                          }}
                        >
                          {medicine.recurrence}
                          {medicine.intervalDays
                            ? ` · every ${medicine.intervalDays} days`
                            : ""}
                        </Text>
                      </View>
                    </View>

                    {medicine.reminderTimes.length > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 12,
                        }}
                      >
                        {medicine.reminderTimes.map((time) => (
                          <TrackerPill
                            key={`${medicine.id}-${time}`}
                            label={time}
                            active
                          />
                        ))}
                      </View>
                    ) : null}

                    {medicine.notes ? (
                      <Text
                        style={{
                          color: "#9A6070",
                          fontSize: 12,
                          marginTop: 10,
                        }}
                      >
                        {medicine.notes}
                      </Text>
                    ) : null}

                    <View
                      style={{ flexDirection: "row", gap: 10, marginTop: 12 }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => startEditingMedicine(medicine)}
                        style={{
                          flex: 1,
                          backgroundColor: "#FDE8EC",
                          borderRadius: 14,
                          paddingVertical: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#C0162C", fontWeight: "800" }}>
                          Edit
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => void handleDeleteMedicine(medicine.id)}
                        style={{
                          flex: 1,
                          backgroundColor: "#FFF2F4",
                          borderRadius: 14,
                          paddingVertical: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#C0162C", fontWeight: "800" }}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </TrackerSection>
          </View>
        </ScrollView>

        {pickerTarget ? (
          <DateTimePicker
            value={pickerValue}
            mode={pickerTarget === "reminderTime" ? "time" : "date"}
            display="default"
            themeVariant="light"
            accentColor="#C0162C"
            textColor="#3A0A12"
            onChange={onPickerChange}
          />
        ) : null}
      </View>
    </ImageBackground>
  );
}
