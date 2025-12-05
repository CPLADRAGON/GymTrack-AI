import { Exercise, DayType } from './types';

// The specific workout plan requested
export const WORKOUT_PLAN: Record<string, Exercise[]> = {
  "Upper A": [
    { name: "Dumbbell Bench Press", sets: "4", reps: "8-12" },
    { name: "Lat Pulldown", sets: "4", reps: "10-12" },
    { name: "Smith Machine Incline Press", sets: "3", reps: "10-12" },
    { name: "Seated Cable Row", sets: "3", reps: "12" },
    { name: "Dumbbell Lateral Raise", sets: "4", reps: "15" }
  ],
  "Lower A": [
    { name: "Smith Machine Squat", sets: "4", reps: "8-10" },
    { name: "Dumbbell RDL", sets: "4", reps: "10-12" },
    { name: "Dumbbell Lunges", sets: "3", reps: "12/leg" },
    { name: "Leg Curl", sets: "3", reps: "15" },
    { name: "Core: Hanging Leg Raise", sets: "3", reps: "Failure" }
  ],
  "Upper B": [
    { name: "Seated Dumbbell Shoulder Press", sets: "4", reps: "8-12" },
    { name: "Pull-ups (or Assisted)", sets: "4", reps: "Failure" },
    { name: "Dips (or Close Grip Press)", sets: "3", reps: "8-12" },
    { name: "Dumbbell Bicep Curls", sets: "3", reps: "12" },
    { name: "Tricep Rope Pushdown", sets: "3", reps: "12" }
  ],
  "Lower B": [
    { name: "Smith Machine Hip Thrust", sets: "4", reps: "10-12" },
    { name: "Goblet Squat", sets: "3", reps: "12" },
    { name: "Calf Raises", sets: "4", reps: "15-20" },
    { name: "Core: Crunches", sets: "3", reps: "15" },
    { name: "Core: Russian Twist", sets: "3", reps: "20" }
  ]
};

// Map JS Date.getDay() (0-6) to our specific split
// 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
export const WEEKLY_SCHEDULE: DayType[] = [
  "Rest",    // Sunday
  "Upper A", // Monday
  "Lower A", // Tuesday
  "Rest",    // Wednesday
  "Upper B", // Thursday
  "Lower B", // Friday
  "Rest"     // Saturday
];

// Simplified Chinese Translations
export const LABELS = {
  appName: "智能健身追踪",
  login: "使用 Google 登录",
  welcome: "欢迎回来",
  todayPlan: "今日计划",
  restDay: "休息日 / 有氧恢复",
  restDayMsg: "今天没有安排力量训练。好好休息，或者做些轻度有氧运动。",
  weight: "重量 (kg/lbs)",
  reps: "完成次数",
  sets: "组数",
  target: "目标",
  finishSet: "记录这组",
  askCoach: "咨询 AI 教练",
  coachTitle: "Gemini AI 教练",
  coachPlaceholder: "例如：给哑铃卧推提个建议...",
  send: "发送",
  close: "关闭",
  configureSheet: "配置 Google Sheet",
  sheetIdPlaceholder: "请输入 Spreadsheet ID",
  save: "保存",
  logging: "正在记录...",
  success: "记录成功！",
  error: "发生错误",
  setupGuide: "请创建一个新的 Google Sheet，并将 URL 中的 ID 复制到此处。APP 将自动创建日志。",
  trainingDay: "训练日",
  exercises: "训练动作"
};

// Mapping internal keys to Chinese display names
export const PLAN_DISPLAY_NAMES: Record<string, string> = {
  "Upper A": "上肢训练 A",
  "Lower A": "下肢训练 A",
  "Upper B": "上肢训练 B",
  "Lower B": "下肢训练 B",
  "Rest": "休息日"
};
