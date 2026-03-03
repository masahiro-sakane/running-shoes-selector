export interface TemplateMenuItem {
  dayOfWeek: number
  trainingType: string
  distanceKm?: number
  description?: string
}

export interface TemplateWeek {
  weekNumber: number
  theme: string
  totalDistanceKm: number
  menuItems: TemplateMenuItem[]
}

export interface TrainingTemplate {
  id: string
  name: string
  targetTime: string
  description: string
  weeksCount: number
  weeks: TemplateWeek[]
}

export const TRAINING_TEMPLATES: TrainingTemplate[] = [
  {
    id: "sub3",
    name: "サブ3達成プログラム",
    targetTime: "2:59:59",
    description:
      "フルマラソン3時間切りを目指す上級者向けプログラム。週6日、70〜90kmの高強度トレーニング。スピード練習とロング走を組み合わせた本格的な内容。",
    weeksCount: 4,
    weeks: [
      {
        weekNumber: 1,
        theme: "ベース構築 - 有酸素能力の向上",
        totalDistanceKm: 72,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 12,
            description: "400m×12本（目標ペース：3:30/km）、リカバリー200mジョグ",
          },
          {
            dayOfWeek: 2,
            trainingType: "dailyJog",
            distanceKm: 12,
            description: "リカバリーペース（5:00〜5:30/km）",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 16,
            description: "マラソンペース（4:15/km）で16km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "dailyJog",
            distanceKm: 10,
            description: "リカバリーペース（5:00〜5:30/km）",
          },
          {
            dayOfWeek: 5,
            trainingType: "paceRun",
            distanceKm: 10,
            description: "テンポ走（4:00/km）で10km走",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 32,
            description: "ロング走 32km（5:00/km）最後5kmをマラソンペースに上げる",
          },
        ],
      },
      {
        weekNumber: 2,
        theme: "スピード強化 - VO2max向上",
        totalDistanceKm: 80,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 14,
            description: "1000m×8本（目標ペース：3:20/km）、リカバリー400mジョグ",
          },
          {
            dayOfWeek: 2,
            trainingType: "dailyJog",
            distanceKm: 12,
            description: "リカバリーペース（5:00〜5:30/km）",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 18,
            description: "マラソンペース（4:15/km）で18km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "recovery",
            distanceKm: 8,
            description: "超スローペース（5:30〜6:00/km）でリカバリー",
          },
          {
            dayOfWeek: 5,
            trainingType: "interval",
            distanceKm: 12,
            description: "800m×8本（目標ペース：3:25/km）、400mリカバリー",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 36,
            description: "ロング走 36km（5:00/km）最後8kmをマラソンペース",
          },
        ],
      },
      {
        weekNumber: 3,
        theme: "特異的持久力 - レースペース対応力",
        totalDistanceKm: 88,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "recovery",
            distanceKm: 8,
            description: "軽いリカバリージョグ（5:30/km）",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 16,
            description: "2000m×5本（目標ペース：3:45/km）、リカバリー800mジョグ",
          },
          {
            dayOfWeek: 2,
            trainingType: "dailyJog",
            distanceKm: 12,
            description: "リカバリーペース（5:00〜5:30/km）",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 20,
            description: "ハーフマラソンペース（4:10/km）で20km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "dailyJog",
            distanceKm: 12,
            description: "リカバリーペース",
          },
          {
            dayOfWeek: 5,
            trainingType: "paceRun",
            distanceKm: 12,
            description: "レースペース確認走（4:15/km）で12km走",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 38,
            description: "ロング走 38km（5:00/km）最後10kmをレースペースに上げる",
          },
        ],
      },
      {
        weekNumber: 4,
        theme: "テーパリング - レース準備",
        totalDistanceKm: 55,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 10,
            description: "400m×8本（レースペース）足の感覚を確認",
          },
          {
            dayOfWeek: 2,
            trainingType: "dailyJog",
            distanceKm: 10,
            description: "リカバリージョグ",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 12,
            description: "マラソンペース（4:15/km）で12km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "recovery",
            distanceKm: 8,
            description: "軽いジョグでコンディション調整",
          },
          {
            dayOfWeek: 5,
            trainingType: "dailyJog",
            distanceKm: 6,
            description: "軽いジョグ（前日調整）",
          },
          {
            dayOfWeek: 6,
            trainingType: "race",
            distanceKm: 42.195,
            description: "レース本番！",
          },
        ],
      },
    ],
  },
  {
    id: "sub3_5",
    name: "サブ3.5達成プログラム",
    targetTime: "3:29:59",
    description:
      "フルマラソン3時間30分切りを目指す中上級者向けプログラム。週5日、55〜70kmのバランス型トレーニング。有酸素能力とペース感覚を同時に養う。",
    weeksCount: 4,
    weeks: [
      {
        weekNumber: 1,
        theme: "有酸素ベース構築",
        totalDistanceKm: 56,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 10,
            description: "1000m×6本（目標ペース：4:00/km）、リカバリー400mジョグ",
          },
          {
            dayOfWeek: 2,
            trainingType: "dailyJog",
            distanceKm: 10,
            description: "楽なペース（5:30〜6:00/km）",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 14,
            description: "マラソンペース（4:58/km）で14km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 5,
            trainingType: "dailyJog",
            distanceKm: 10,
            description: "ゆったりジョグ",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 28,
            description: "ロング走 28km（5:30/km）後半5kmをマラソンペースに",
          },
        ],
      },
      {
        weekNumber: 2,
        theme: "スピード持久力の強化",
        totalDistanceKm: 64,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 12,
            description: "800m×8本（目標ペース：3:50/km）、400mリカバリー",
          },
          {
            dayOfWeek: 2,
            trainingType: "dailyJog",
            distanceKm: 10,
            description: "リカバリーペース",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 16,
            description: "マラソンペース（4:58/km）で16km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "recovery",
            distanceKm: 6,
            description: "超スローペースでリカバリー",
          },
          {
            dayOfWeek: 5,
            trainingType: "paceRun",
            distanceKm: 8,
            description: "テンポ走（4:30/km）で8km走",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 32,
            description: "ロング走 32km（5:30/km）最後7kmをレースペースに",
          },
        ],
      },
      {
        weekNumber: 3,
        theme: "レース特異的練習",
        totalDistanceKm: 70,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "recovery",
            distanceKm: 6,
            description: "軽いリカバリージョグ",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 14,
            description: "2000m×4本（目標ペース：4:30/km）、600mリカバリー",
          },
          {
            dayOfWeek: 2,
            trainingType: "dailyJog",
            distanceKm: 10,
            description: "リカバリーペース",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 18,
            description: "マラソンペース（4:58/km）で18km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 5,
            trainingType: "paceRun",
            distanceKm: 10,
            description: "レースペース確認走（4:58/km）",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 35,
            description: "ロング走 35km（5:20/km）最後8kmをレースペース",
          },
        ],
      },
      {
        weekNumber: 4,
        theme: "テーパリング - コンディション整備",
        totalDistanceKm: 45,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 8,
            description: "1000m×4本（レースペース確認）",
          },
          {
            dayOfWeek: 2,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "リカバリージョグ",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 10,
            description: "マラソンペース（4:58/km）で10km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "recovery",
            distanceKm: 6,
            description: "軽いジョグでコンディション確認",
          },
          {
            dayOfWeek: 5,
            trainingType: "dailyJog",
            distanceKm: 5,
            description: "前日の軽い調整走",
          },
          {
            dayOfWeek: 6,
            trainingType: "race",
            distanceKm: 42.195,
            description: "レース本番！",
          },
        ],
      },
    ],
  },
  {
    id: "sub4",
    name: "サブ4達成プログラム",
    targetTime: "3:59:59",
    description:
      "フルマラソン4時間切りを目指す中級者向けプログラム。週4日、40〜55kmの距離重視トレーニング。継続的なジョグと適度なロング走で完走力を養う。",
    weeksCount: 4,
    weeks: [
      {
        weekNumber: 1,
        theme: "有酸素基盤の構築",
        totalDistanceKm: 42,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "dailyJog",
            distanceKm: 10,
            description: "楽なペース（6:00〜6:30/km）でジョグ",
          },
          {
            dayOfWeek: 2,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 12,
            description: "マラソンペース（5:41/km）で12km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 5,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "楽なペースでジョグ",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 25,
            description: "ロング走 25km（6:00〜6:30/km）会話できるペースで",
          },
        ],
      },
      {
        weekNumber: 2,
        theme: "距離増加 - 持久力向上",
        totalDistanceKm: 48,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 8,
            description: "1000m×5本（目標ペース：5:00/km）、500mリカバリー",
          },
          {
            dayOfWeek: 2,
            trainingType: "recovery",
            distanceKm: 6,
            description: "軽いリカバリージョグ",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 14,
            description: "マラソンペース（5:41/km）で14km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 5,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "楽なペースでジョグ",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 28,
            description: "ロング走 28km（6:00/km）後半5kmをレースペースに",
          },
        ],
      },
      {
        weekNumber: 3,
        theme: "レースペース慣れ",
        totalDistanceKm: 55,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "recovery",
            distanceKm: 6,
            description: "軽いリカバリージョグ",
          },
          {
            dayOfWeek: 1,
            trainingType: "interval",
            distanceKm: 10,
            description: "1000m×6本（目標ペース：5:00/km）",
          },
          {
            dayOfWeek: 2,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "リカバリーペース",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 16,
            description: "マラソンペース（5:41/km）で16km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 5,
            trainingType: "dailyJog",
            distanceKm: 10,
            description: "楽なペース",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 30,
            description: "ロング走 30km（5:50/km）最後5kmをレースペース",
          },
        ],
      },
      {
        weekNumber: 4,
        theme: "テーパリング",
        totalDistanceKm: 38,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "楽なペースでジョグ",
          },
          {
            dayOfWeek: 2,
            trainingType: "recovery",
            distanceKm: 6,
            description: "軽いジョグ",
          },
          {
            dayOfWeek: 3,
            trainingType: "paceRun",
            distanceKm: 10,
            description: "マラソンペース（5:41/km）で10km走",
          },
          {
            dayOfWeek: 4,
            trainingType: "recovery",
            distanceKm: 6,
            description: "コンディション確認のジョグ",
          },
          {
            dayOfWeek: 5,
            trainingType: "dailyJog",
            distanceKm: 5,
            description: "前日の軽い調整走",
          },
          {
            dayOfWeek: 6,
            trainingType: "race",
            distanceKm: 42.195,
            description: "レース本番！",
          },
        ],
      },
    ],
  },
  {
    id: "beginner",
    name: "マラソン初心者プログラム",
    targetTime: "5:00:00",
    description:
      "初めてのフルマラソン完走を目指す初心者向けプログラム。週3日、25〜40kmの無理のない構成。楽しく走り続けることを最優先に。",
    weeksCount: 4,
    weeks: [
      {
        weekNumber: 1,
        theme: "走ることに慣れる",
        totalDistanceKm: 25,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "dailyJog",
            distanceKm: 6,
            description: "楽なペース（7:00〜8:00/km）でジョグ。会話できるペース",
          },
          {
            dayOfWeek: 2,
            trainingType: "rest",
            description: "休養（軽いストレッチOK）",
          },
          {
            dayOfWeek: 3,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "楽なペース（7:00〜8:00/km）でジョグ",
          },
          {
            dayOfWeek: 4,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 5,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 15,
            description: "ロング走 15km（7:00〜8:00/km）歩いても大丈夫",
          },
        ],
      },
      {
        weekNumber: 2,
        theme: "ゆっくり距離を伸ばす",
        totalDistanceKm: 30,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "楽なペースでジョグ",
          },
          {
            dayOfWeek: 2,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 3,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "楽なペースでジョグ",
          },
          {
            dayOfWeek: 4,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 5,
            trainingType: "recovery",
            distanceKm: 5,
            description: "軽いジョグで疲れを取る",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 20,
            description: "ロング走 20km（7:00〜8:00/km）無理せず楽しく",
          },
        ],
      },
      {
        weekNumber: 3,
        theme: "体力を底上げする",
        totalDistanceKm: 38,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "recovery",
            distanceKm: 5,
            description: "軽いリカバリージョグ",
          },
          {
            dayOfWeek: 1,
            trainingType: "dailyJog",
            distanceKm: 10,
            description: "楽なペースでジョグ",
          },
          {
            dayOfWeek: 2,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 3,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "楽なペース",
          },
          {
            dayOfWeek: 4,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 5,
            trainingType: "recovery",
            distanceKm: 5,
            description: "軽いジョグ",
          },
          {
            dayOfWeek: 6,
            trainingType: "longRun",
            distanceKm: 25,
            description: "ロング走 25km（7:00〜8:00/km）給水をこまめに",
          },
        ],
      },
      {
        weekNumber: 4,
        theme: "仕上げ - レース準備",
        totalDistanceKm: 30,
        menuItems: [
          {
            dayOfWeek: 0,
            trainingType: "rest",
            description: "完全休養",
          },
          {
            dayOfWeek: 1,
            trainingType: "dailyJog",
            distanceKm: 8,
            description: "楽なペースでジョグ",
          },
          {
            dayOfWeek: 2,
            trainingType: "rest",
            description: "休養",
          },
          {
            dayOfWeek: 3,
            trainingType: "dailyJog",
            distanceKm: 6,
            description: "軽めのジョグ",
          },
          {
            dayOfWeek: 4,
            trainingType: "recovery",
            distanceKm: 5,
            description: "コンディション確認のジョグ",
          },
          {
            dayOfWeek: 5,
            trainingType: "rest",
            description: "完全休養（荷物の準備など）",
          },
          {
            dayOfWeek: 6,
            trainingType: "race",
            distanceKm: 42.195,
            description: "レース本番！楽しんで完走しよう",
          },
        ],
      },
    ],
  },
]
