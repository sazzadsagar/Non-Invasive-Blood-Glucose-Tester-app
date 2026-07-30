import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Droplet,
  BookOpen,
  Settings as SettingsIcon,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Globe,
  Ruler,
  Target,
  Download,
  Star,
  Share2,
  Pencil,
  Trash2,
  Activity,
  AlertTriangle,
  Apple,
  TestTube2,
  History as HistoryIcon,
  Printer,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ---------- Design tokens ----------
// Ink navy background, sea-glass teal accent, soft slate cards.
const COLORS = {
  bg: "#171b2e",
  card: "#242a45",
  card2: "#2c3358",
  ink: "#eef0fb",
  sub: "#9aa1c4",
  teal: "#2bd9c9",
  tealDim: "#1a5c56",
  red: "#e8607a",
  amber: "#f0b64c",
  green: "#5fce8f",
  blue: "#5b8bf0",
  purple: "#a687f2",
};

const LOGO_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAIAAACxN37FAAAnRklEQVR42u2dd1wUV9fHZ7bDLk16W0VERYrd2LDEgkZj71iTGDEqwQTzoBFLCmINKgRR4qNJLEmMxhJNom9ERTFWECEoIr0sIB22zsz7x3m9n3l3kRhDlJjz/YMPOzsz98yd323nnnuX5jiOQpCXBQFmAYKCRhAUNIKgoBEEBY0gKGgEQUEjCAoaQUEjCAoaQVDQCIKCRhAUNIKCRhAUNIKgoBEEBY0gKGgEQUEjCAoaQVDQCAoaQVDQCIKCRhAUNIKgoBEUNIKgoBEEBY0gKGgEQUEjKGgEQUEjCAoaQVDQCAoaQVDQCIKCRhAUNIKgoBEUNIKgoBEEBY0gKGgEQUEjKGgEQUEjCAoaQVDQCIKCRlDQCIKCRhAUNIKgoBEUNIKgoBEEBY0gKGgEQUEjKGgEQUEjCAoaQVDQCAoaQVDQCIKCRhAUNIKgoBEEBY0gKGgEQUEjCAoaQUEjCAoaQVDQCIKCRhAUNIKgoBEUNIKgoBEEBY0gKGgEQUEjKGgEQUEjCAoaQVDQCAoaQf6x/D8U5xTCEnJctQAAAABJRU5ErkJggg==";

const UNITS = { mgdl: "mg/dL", mmol: "mmol/L" };

const toMmol = (mgdl) => mgdl / 18.0182;
const fmt = (v, unit) =>
  unit === "mgdl" ? Math.round(v).toString() : toMmol(v).toFixed(1);

function statusFor(mgdl) {
  if (mgdl < 70) return { label: "Low", color: COLORS.red };
  if (mgdl <= 140) return { label: "Normal", color: COLORS.green };
  if (mgdl <= 180) return { label: "Elevated", color: COLORS.amber };
  return { label: "High", color: COLORS.red };
}

function nowLabel(d) {
  const date = new Date(d);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    ", " +
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

const SEED = [
  { id: "e1", value: 92, tag: "Fasting", ts: Date.now() - 1000 * 60 * 60 * 30 },
  { id: "e2", value: 118, tag: "After meal", ts: Date.now() - 1000 * 60 * 60 * 20 },
  { id: "e3", value: 104, tag: "Default", ts: Date.now() - 1000 * 60 * 60 * 10 },
  { id: "e4", value: 96, tag: "Fasting", ts: Date.now() - 1000 * 60 * 60 * 2 },
];

const INFO_ARTICLES_EN = [
  {
    id: "ranges",
    title: "Know Normal Blood Sugar Levels",
    icon: Droplet,
    color: COLORS.blue,
    summary: "What counts as normal, and what targets look like with diabetes.",
    body: [
      "Knowing normal blood sugar ranges can be a crucial part of diabetes self-management. Under different conditions and age groups, ranges can vary, such as before eating or fasting, after eating a meal, children, adults, etc. If you have diabetes, the blood sugar target is the range you try to reach as much as possible. This article will introduce both normal ranges and diabetic's blood sugar targets specifically.",
      { heading: "Adults Blood Sugar Ranges" },
      "Normal ranges — for adults, according to diabetes.co.uk and the American Diabetes Association, people without diabetes have normal blood sugar levels as follows: before meals or when fasting, 4.0 to 5.4 mmol/L (72 to 99 mg/dL); at least 90 minutes after eating, under 7.8 mmol/L (140 mg/dL).\nDiabetic ranges — adults with diabetes have blood sugar level targets as below:\nType 1 diabetes: upon waking, 5.0 to 7.0 mmol/L (90 to 126 mg/dL); before meals or when fasting, 4.0 to 7.0 mmol/L (72 to 126 mg/dL); at least 90 minutes after eating, 5.0 to 9.0 mmol/L (90 to 162 mg/dL).\nType 2 diabetes: before meals or when fasting, 4.0 to 7.0 mmol/L (72 to 126 mg/dL); at least 90 minutes after eating, under 8.5 mmol/L (153 mg/dL).",
      "Children's normal blood sugar levels under 6: 4.5 to 11.1 mmol/L (80 to 200 mg/dL) each day.\nChildren's normal blood sugar levels between 6 and 12: when fasting, 4.5 to 10 mmol/L (80 to 180 mg/dL); before meals, 5 to 10 mmol/L (90 to 180 mg/dL); one to two hours after meals, under 7.8 mmol/L (140 mg/dL).\nTeens' normal blood sugar levels aging from 13 to 19: when fasting, 3.9 to 8.3 mmol/L (70 to 150 mg/dL); before meals, 5 to 7.2 mmol/L (90 to 130 mg/dL); one to two hours after meals, under 7.8 mmol/L (140 mg/dL).",
      "Except for normal and diabetic blood sugar levels, people can have hypoglycemia, which occurs when their blood sugar levels drop below 3.89 mmol/L (70 mg/dL). Symptoms would not present until blood sugar levels drop under 3 mmol/L (55 mg/dL). However, if you have any additional health problems or other factors, the blood sugar level targets mentioned above may not apply to your situation. It is vital to consult your healthcare provider for your targets.",
    ],
  },
  {
    id: "types",
    title: "Common Types of Diabetes",
    icon: TestTube2,
    color: COLORS.purple,
    summary: "Type 1, type 2, gestational, and prediabetes — how they differ.",
    body: [
      "Do you know that diabetes has more than one condition? There are three main types of diabetes: type 1, type 2, and gestational diabetes. All of them are complex and require daily care and management. To understand each kind of them, you cannot miss the content below.",
      { heading: "Type 1 diabetes" },
      "Type 1 diabetes indicates that your body makes little or stops producing insulin. It is usually diagnosed in children, teens, and young adults. People with type 1 diabetes will need to take insulin every day to control their blood sugar levels.",
      { heading: "Type 2 diabetes" },
      "Type 2 diabetes means your body does not make or use insulin well. It is usually diagnosed in overweight middle-aged and older people who lack physical activity. It is the most common type of diabetes.",
      { heading: "Gestational diabetes" },
      "Gestational diabetes develops in some women when they are pregnant. Usually, this type of diabetes goes away after their delivery. However, after giving birth, they and their children have a greater chance of developing type 2 diabetes later.",
      "Besides, some people can have prediabetes, having blood sugar levels higher than normal but not high enough to be diagnosed with type 2 diabetes. Prediabetes raises the risk for type 2 diabetes. People with it need to record their blood sugar levels constantly and change their lifestyles. What needs to mention is that about 1% to 5% of people might get diabetes due to other reasons. For instance, diseases of the pancreas, certain surgeries and medications, and infections can lead to other types of diabetes.",
    ],
  },
  {
    id: "signs",
    title: "Diabetes and Carbohydrate Intake",
    icon: AlertTriangle,
    color: COLORS.red,
    summary: "Carb counting and diabetes.",
    body: [
      { heading: "Carb counting and diabetes" },
      "If you have diabetes, counting carbs is an effective way to help your blood sugar control. That's because when your body digests foods and drinks containing carbs, all the carbs are broken down into glucose to provide your body with energy, which in the meantime, increases your blood sugar level. People without diabetes can produce insulin to keep blood sugar levels from rising too high. However, that doesn't work for diabetics.",
      "Therefore, if you don't count the carbs you eat every day, you may get diabetes complications caused by having too much blood sugar in your bloodstream. To stay away from diabetes complications and enjoy a healthier lifestyle, it is necessary to count carbs intake daily.",
      { heading: "How many carbs should a diabetic have per day" },
      "According to the American Diabetes Association (ADA), people with diabetes should get about 45% of their calories from carbohydrates. However, that percentage cannot apply to every individual as dietary preferences and metabolic goals vary from person to person.",
      "Generally, if you are an adult, the carbs intake goal is 45-60 grams of carbs per meal and 15-20 grams per snack. Besides, the numbers can differ if you take medicine or exercise regularly. It is better to consult your doctor for a precise carbs goal for you. To make you count carbs more intuitively, every four calories you eat includes one gram of carbs.",
      "If you want a stable blood sugar level throughout the day, you'd better eat approximately the same amount of carbs at each meal. Nevertheless, you don't need to be so strict if you are using an insulin pump or taking multiple types of insulin injections.",
    ],
  },
  {
    id: "carbs",
    title: "Dietary Advice for Diabetes",
    icon: Activity,
    color: COLORS.amber,
    summary: "Why carbs matter so much for day-to-day control.",
    body: [
      "Even though having diabetes can mean a different life than it used to be, it doesn't mean you have to alter your lifestyle altogether. What you need is a more healthy one involving more physical activity and a diet suited for diabetes. This article introduces some dietary tips and recommendations for diabetes, a great reference for almost everyone.",
      "Carbohydrates break down into blood glucose during digestion. Try sticking to healthy carbohydrates such as fruit and vegetables; whole grains including wheat, brown rice, oats, cornmeal, barley, buckwheat and quinoa; legumes, such as beans and peas; and low-fat dairy products, such as milk and cheese. Besides, you should also be aware of those unhealthy carbohydrates such as ultra-processed food and foods with added fats and sugars.",
      { heading: "Eat more fruits and vegetables" },
      "Fruits and vegetables are low in calories and fat and full of fiber, vitamins, and minerals. Eating more fruits and vegetables can help prevent diseases like stroke, heart disease and high blood pressure, which more often develop in diabetics. However, you might say that fruits also have sugar. Don't worry — the sugar contained in whole fruit is called natural sugar, healthy for everyone. Diabetics are no exception.",
      { heading: "Eat healthier fat" },
      "Fat is essential for our body to generate energy and absorb vitamins and minerals to improve our immune system. However, not all fat affects our body positively. Choose foods with healthier fats such as unsalted nuts, seeds, avocados, oily fish, olive oil, rapeseed oil and sunflower oil. Saturated fats can increase the cholesterol content in your blood and the risk of heart problems, so try not to eat or eat less red and processed meat, butter and lard.",
      { heading: "Cut down on added sugar" },
      "Added sugar is different from natural sugar mentioned before. Added sugar is not good for our health and often exists in products like chocolates, biscuits, cakes and fruit juice. It is hard to cut out sugar from the start. Here are some suggestions:",
      { bullet: "Choose alternatives such as milk, tea and coffee without sugar for sugary drinks, and energy drinks." },
      { bullet: "Go for whole fruits instead of fruit juices." },
      { bullet: "Try zero or low-calorie sweeteners." },
      { bullet: "Foster the habit of checking labels for sugar content when shopping for food." },
      { heading: "Restrict the alcohol consumption" },
      "If you have diabetes and are trying to lose some weight, you'd better cut back on your alcohol intake. Adhere to the maximum of 14 units a week or limit the alcohol to two drinks a day if you are a man and one drink a day if you are a woman. Avoid drinking on an empty stomach, which can put you at risk of hypo.",
      { heading: "Other dietary tips for you" },
      { bullet: "Choose healthier cooking methods such as boiling, steaming and poaching." },
      { bullet: "Foster a regular eating habit. Three meals and three snacks a day and avoid eating too much or too little in the same meal." },
      { bullet: "Keep an eye on what you eat every day. Pay attention to the values of fats, salt and sugar." },
      { bullet: "Don't be obsessed with supposed diabetic food. Make your dietary plan scientifically." },
    ],
  },
  {
    id: "diet",
    title: "Eating Well with Diabetes",
    icon: Apple,
    color: COLORS.green,
    summary: "Practical, everyday dietary habits.",
    body: [
      "Managing diabetes revolves around maintaining steady blood sugar levels, protecting heart health, and building sustainable, nutrient-rich habits. Here is a practical breakdown of how to structure meals effectively.",
      { heading: "1. High-Fiber & Low-GI Carbohydrates" },
      "Carbohydrates directly impact blood glucose, but whole, fiber-rich sources are absorbed more slowly, preventing rapid spikes.",
      { bullet: "Favor: Non-starchy vegetables (spinach, broccoli, peppers), legumes (lentils, chickpeas, black beans), whole grains (oats, brown rice, quinoa), and whole fruits (berries, apples)." },
      { bullet: "Limit: Refined grains (white bread, white rice, regular pasta) and sweet pastries." },
      { bullet: "Note on Fruit: Whole fruits contain natural sugars alongside fiber, which changes how the body metabolizes them compared to added sugars in drinks or candies." },
      { heading: "2. Lean Proteins" },
      "Protein helps maintain satiety without raising blood sugar directly.",
      { bullet: "Best Options: Skinless poultry, fish (especially fatty fish like salmon, sardines, and mackerel), eggs, tofu, and legumes." },
      { bullet: "Limit: High-fat, heavily processed meats like bacon, hot dogs, and salami." },
      { heading: "3. Heart-Healthy Unsaturated Fats." },
      "Because cardiovascular risk is elevated with diabetes, swapping saturated fats for healthy unsaturated fats supports long-term heart health.",
      { bullet: "Favor: Extra-virgin olive oil, avocados, seeds (chia, flaxseed), and nuts." },
      { bullet: "Limit: High-fat dairy, butter, palm oil, and deep-fried foods containing trans fats." },
    ],
  },
  {
    id: "testing",
    title: "Testing at Home",
    icon: TestTube2,
    color: COLORS.teal,
    summary: "Getting reliable readings from a home meter.",
    body: [
      "Wash and dry hands before testing — leftover food residue on fingers is a common cause of falsely high readings.",
      "Rotating which finger is used and pricking the side rather than the pad reduces soreness over time.",
      "Logging the context of each reading (fasting, before a meal, after a meal, before bed) makes the pattern far more useful than the number alone.",
      "Meters and strips do have a margin of error, so a single unusual reading is worth rechecking rather than reacting to right away.",
    ],
  },
];

const INFO_ARTICLES_BN = [
  {
    id: "ranges",
    title: "স্বাভাবিক ব্লাড সুগার লেভেল জানুন",
    icon: Droplet,
    color: COLORS.blue,
    summary: "ডায়াবেটিসে স্বাভাবিক মাত্রা কী, আর টার্গেট কেমন হয়।",
    body: [
      "স্বাভাবিক ব্লাড সুগার রেঞ্জ জানা ডায়াবেটিস সেলফ-ম্যানেজমেন্টের একটা গুরুত্বপূর্ণ অংশ হতে পারে। বিভিন্ন অবস্থা ও বয়সের গ্রুপে রেঞ্জ ভিন্ন হয়, যেমন খাওয়ার আগে বা খালি পেটে, খাওয়ার পরে, শিশু, প্রাপ্তবয়স্ক ইত্যাদি। তোমার ডায়াবেটিস থাকলে, ব্লাড সুগার টার্গেট হলো সেই রেঞ্জ যেটাতে যতটা সম্ভব থাকার চেষ্টা করবে। এই আর্টিকেলে স্বাভাবিক রেঞ্জ এবং ডায়াবেটিক ব্লাড সুগার টার্গেট দুটোই আলোচনা করা হবে।",
      { heading: "প্রাপ্তবয়স্কদের ব্লাড সুগার রেঞ্জ" },
      "স্বাভাবিক রেঞ্জ — diabetes.co.uk এবং American Diabetes Association অনুযায়ী, ডায়াবেটিস নেই এমন প্রাপ্তবয়স্কদের স্বাভাবিক ব্লাড সুগার লেভেল: খাওয়ার আগে বা খালি পেটে ৪.০ থেকে ৫.৪ mmol/L (৭২ থেকে ৯৯ mg/dL); খাওয়ার অন্তত ৯০ মিনিট পরে ৭.৮ mmol/L (১৪০ mg/dL)-এর নিচে।\nডায়াবেটিক রেঞ্জ — ডায়াবেটিসে আক্রান্ত প্রাপ্তবয়স্কদের টার্গেট নিচে দেওয়া হলো:\nটাইপ ১ ডায়াবেটিস: ঘুম থেকে উঠার পর ৫.০ থেকে ৭.০ mmol/L (৯০ থেকে ১২৬ mg/dL); খাওয়ার আগে বা খালি পেটে ৪.০ থেকে ৭.০ mmol/L (৭২ থেকে ১২৬ mg/dL); খাওয়ার অন্তত ৯০ মিনিট পরে ৫.০ থেকে ৯.০ mmol/L (৯০ থেকে ১৬২ mg/dL)।\nটাইপ ২ ডায়াবেটিস: খাওয়ার আগে বা খালি পেটে ৪.০ থেকে ৭.০ mmol/L (৭২ থেকে ১২৬ mg/dL); খাওয়ার অন্তত ৯০ মিনিট পরে ৮.৫ mmol/L (১৫৩ mg/dL)-এর নিচে।",
      "৬ বছরের কম বয়সী শিশুদের স্বাভাবিক ব্লাড সুগার লেভেল: প্রতিদিন ৪.৫ থেকে ১১.১ mmol/L (৮০ থেকে ২০০ mg/dL)।\n৬ থেকে ১২ বছর বয়সী শিশুদের স্বাভাবিক লেভেল: খালি পেটে ৪.৫ থেকে ১০ mmol/L (৮০ থেকে ১৮০ mg/dL); খাওয়ার আগে ৫ থেকে ১০ mmol/L (৯০ থেকে ১৮০ mg/dL); খাওয়ার এক-দুই ঘণ্টা পরে ৭.৮ mmol/L (১৪০ mg/dL)-এর নিচে।\n১৩ থেকে ১৯ বছর বয়সী কিশোর-কিশোরীদের স্বাভাবিক লেভেল: খালি পেটে ৩.৯ থেকে ৮.৩ mmol/L (৭০ থেকে ১৫০ mg/dL); খাওয়ার আগে ৫ থেকে ৭.২ mmol/L (৯০ থেকে ১৩০ mg/dL); খাওয়ার এক-দুই ঘণ্টা পরে ৭.৮ mmol/L (১৪০ mg/dL)-এর নিচে।",
      "স্বাভাবিক ও ডায়াবেটিক ব্লাড সুগার লেভেল ছাড়াও, মানুষের হাইপোগ্লাইসেমিয়া হতে পারে, যা ঘটে যখন ব্লাড সুগার লেভেল ৩.৮৯ mmol/L (৭০ mg/dL)-এর নিচে নেমে যায়। ব্লাড সুগার ৩ mmol/L (৫৫ mg/dL)-এর নিচে না নামা পর্যন্ত সাধারণত লক্ষণ দেখা দেয় না। তবে অন্য কোনো স্বাস্থ্য সমস্যা বা factor থাকলে উপরের টার্গেট তোমার ক্ষেত্রে প্রযোজ্য নাও হতে পারে। তোমার নিজস্ব টার্গেটের জন্য স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করা জরুরি।",
    ],
  },
  {
    id: "types",
    title: "ডায়াবেটিসের সাধারণ ধরন",
    icon: TestTube2,
    color: COLORS.purple,
    summary: "টাইপ ১, টাইপ ২, গর্ভাবস্থাকালীন ও প্রি-ডায়াবেটিস — পার্থক্য কী।",
    body: [
      "তুমি কি জানো ডায়াবেটিসের একাধিক অবস্থা আছে? ডায়াবেটিসের তিনটি প্রধান ধরন আছে: টাইপ ১, টাইপ ২, এবং গর্ভাবস্থাকালীন (gestational) ডায়াবেটিস। এগুলো সবই জটিল এবং প্রতিদিনের যত্ন ও ব্যবস্থাপনা দরকার। প্রতিটার ধরন বুঝতে নিচের content মিস করো না।",
      { heading: "টাইপ ১ ডায়াবেটিস" },
      "টাইপ ১ ডায়াবেটিস মানে শরীর সামান্য ইনসুলিন তৈরি করে বা একদমই বন্ধ করে দেয়। এটা সাধারণত শিশু, কিশোর-কিশোরী ও তরুণদের মধ্যে ধরা পড়ে। টাইপ ১ ডায়াবেটিস থাকলে প্রতিদিন ইনসুলিন নিতে হবে ব্লাড সুগার নিয়ন্ত্রণে রাখতে।",
      { heading: "টাইপ ২ ডায়াবেটিস" },
      "টাইপ ২ ডায়াবেটিস মানে শরীর ঠিকমতো ইনসুলিন তৈরি করে না বা ব্যবহার করতে পারে না। এটা সাধারণত অতিরিক্ত ওজনের মধ্যবয়সী ও বয়স্কদের মধ্যে ধরা পড়ে যাদের শারীরিক কার্যকলাপ কম। এটাই সবচেয়ে সাধারণ ডায়াবেটিসের ধরন।",
      { heading: "গর্ভাবস্থাকালীন ডায়াবেটিস" },
      "কিছু নারীর গর্ভাবস্থায় গর্ভাবস্থাকালীন ডায়াবেটিস দেখা দেয়। সাধারণত এটা সন্তান জন্মের পর চলে যায়। তবে জন্মের পর, মা এবং সন্তান দুজনেরই পরবর্তীতে টাইপ ২ ডায়াবেটিস হওয়ার সম্ভাবনা বেশি থাকে।",
      "এছাড়া কিছু মানুষের প্রি-ডায়াবেটিস হতে পারে, যেখানে ব্লাড সুগার স্বাভাবিকের চেয়ে বেশি কিন্তু টাইপ ২ ডায়াবেটিস নির্ণয়ের জন্য যথেষ্ট বেশি না। প্রি-ডায়াবেটিস টাইপ ২ ডায়াবেটিসের ঝুঁকি বাড়ায়। এই অবস্থায় থাকলে নিয়মিত ব্লাড সুগার রেকর্ড রাখা ও লাইফস্টাইল পরিবর্তন করা দরকার। উল্লেখযোগ্য যে, প্রায় ১% থেকে ৫% মানুষ অন্য কারণে ডায়াবেটিসে আক্রান্ত হতে পারে — যেমন প্যানক্রিয়াসের রোগ, নির্দিষ্ট সার্জারি বা ওষুধ, এবং ইনফেকশন।",
    ],
  },
  {
    id: "signs",
    title: "ডায়াবেটিস ও কার্বোহাইড্রেট গ্রহণ",
    icon: AlertTriangle,
    color: COLORS.red,
    summary: "কার্ব কাউন্টিং ও ডায়াবেটিস।",
    body: [
      { heading: "কার্ব কাউন্টিং ও ডায়াবেটিস" },
      "ডায়াবেটিস থাকলে, কার্ব কাউন্ট করা ব্লাড সুগার নিয়ন্ত্রণে সাহায্য করার একটা কার্যকর উপায়। কারণ শরীর যখন কার্ব-যুক্ত খাবার ও পানীয় হজম করে, সব কার্ব গ্লুকোজে ভেঙে শক্তি সরবরাহ করে, যা একইসাথে ব্লাড সুগার লেভেল বাড়িয়ে দেয়। ডায়াবেটিস নেই এমন মানুষ ইনসুলিন তৈরি করে ব্লাড সুগার খুব বেশি বাড়া থেকে ঠেকাতে পারে। কিন্তু ডায়াবেটিক-দের ক্ষেত্রে এটা কাজ করে না।",
      "তাই, প্রতিদিন খাওয়া কার্ব কাউন্ট না করলে, রক্তে অতিরিক্ত সুগারের কারণে ডায়াবেটিস কমপ্লিকেশন হতে পারে। কমপ্লিকেশন এড়াতে ও স্বাস্থ্যকর জীবনযাপনের জন্য প্রতিদিন কার্ব ইনটেক কাউন্ট করা প্রয়োজন।",
      { heading: "একজন ডায়াবেটিকের দিনে কতটুকু কার্ব দরকার" },
      "American Diabetes Association (ADA) অনুযায়ী, ডায়াবেটিস থাকলে মোট ক্যালরির প্রায় ৪৫% কার্বোহাইড্রেট থেকে আসা উচিত। তবে এই percentage সবার ক্ষেত্রে প্রযোজ্য না, কারণ dietary preference ও metabolic goal ব্যক্তি অনুযায়ী ভিন্ন হয়।",
      "সাধারণভাবে, প্রাপ্তবয়স্কদের জন্য কার্ব ইনটেক গোল প্রতি মিলে ৪৫-৬০ গ্রাম এবং প্রতি স্ন্যাকে ১৫-২০ গ্রাম। এছাড়া, ওষুধ খেলে বা নিয়মিত ব্যায়াম করলে সংখ্যা ভিন্ন হতে পারে। সঠিক কার্ব গোলের জন্য ডাক্তারের সাথে পরামর্শ করাই ভালো। সহজে বুঝতে: প্রতি চার ক্যালরিতে এক গ্রাম কার্ব থাকে।",
      "সারাদিন স্থির ব্লাড সুগার লেভেল চাইলে, প্রতি মিলে প্রায় একই পরিমাণ কার্ব খাওয়া ভালো। তবে ইনসুলিন পাম্প ব্যবহার করলে বা একাধিক ধরনের ইনসুলিন ইনজেকশন নিলে এতটা কঠোর হওয়ার দরকার নেই।",
    ],
  },
  {
    id: "carbs",
    title: "ডায়াবেটিসের জন্য ডায়েট পরামর্শ",
    icon: Activity,
    color: COLORS.amber,
    summary: "দৈনন্দিন নিয়ন্ত্রণে কার্ব কেন এত গুরুত্বপূর্ণ।",
    body: [
      "ডায়াবেটিস থাকা মানে জীবন একেবারে বদলে যাওয়া না — দরকার একটা বেশি স্বাস্থ্যকর জীবনযাপন, বেশি শারীরিক কার্যকলাপ, আর ডায়াবেটিসের উপযোগী ডায়েট। এই আর্টিকেলে ডায়াবেটিসের জন্য কিছু ডায়েট টিপস ও পরামর্শ দেওয়া হলো, প্রায় সবার জন্যই কাজে লাগবে।",
      "হজমের সময় কার্বোহাইড্রেট ব্লাড গ্লুকোজে ভেঙে যায়। স্বাস্থ্যকর কার্বোহাইড্রেট বেছে নাও — যেমন ফল ও সবজি; পুরো শস্য (গম, ব্রাউন রাইস, ওটস, কর্নমিল, বার্লি, বাকহুইট, কিনোয়া); বীজজাতীয় (মটরশুঁটি, ডাল); এবং কম-ফ্যাটযুক্ত দুগ্ধজাত পণ্য (দুধ, পনির)। এর পাশাপাশি অস্বাস্থ্যকর কার্বোহাইড্রেট যেমন আল্ট্রা-প্রসেসড ফুড এবং অতিরিক্ত ফ্যাট-সুগারযুক্ত খাবার সম্পর্কেও সচেতন থাকো।",
      { heading: "বেশি ফল ও সবজি খাও" },
      "ফল ও সবজি ক্যালরি ও ফ্যাটে কম কিন্তু ফাইবার, ভিটামিন ও মিনারেলে ভরপুর। বেশি ফল-সবজি খেলে স্ট্রোক, হার্ট ডিজিজ ও উচ্চ রক্তচাপের মতো রোগ প্রতিরোধ করা যায়, যেগুলো ডায়াবেটিকদের মধ্যে বেশি দেখা যায়। ফলে সুগার থাকে বলে চিন্তার কিছু নেই — গোটা ফলের সুগারকে natural sugar বলে, যেটা সবার জন্যই স্বাস্থ্যকর, ডায়াবেটিকরাও ব্যতিক্রম না।",
      { heading: "স্বাস্থ্যকর ফ্যাট খাও" },
      "শক্তি উৎপাদন ও ভিটামিন-মিনারেল শোষণের জন্য ফ্যাট আমাদের শরীরে জরুরি, এতে immune system-ও ভালো থাকে। তবে সব ফ্যাট শরীরে ইতিবাচক প্রভাব ফেলে না। স্বাস্থ্যকর ফ্যাটযুক্ত খাবার বেছে নাও — যেমন লবণবিহীন বাদাম, বীজ, অ্যাভোকাডো, তেলযুক্ত মাছ, অলিভ অয়েল, রেপসিড অয়েল ও সূর্যমুখী তেল। স্যাচুরেটেড ফ্যাট রক্তে কোলেস্টেরল ও হার্ট প্রবলেমের ঝুঁকি বাড়ায়, তাই লাল ও প্রসেসড মাংস, মাখন ও ঘি কম খাওয়ার চেষ্টা করো।",
      { heading: "যোগ করা সুগার কমাও" },
      "যোগ করা সুগার আগে বলা natural sugar থেকে আলাদা। যোগ করা সুগার স্বাস্থ্যের জন্য ভালো না, আর প্রায়ই চকলেট, বিস্কুট, কেক ও ফলের জুসে থাকে। শুরুতে সুগার একদমই বাদ দেওয়া কঠিন। কিছু পরামর্শ:",
      { bullet: "সুগারযুক্ত পানীয় ও এনার্জি ড্রিংকের বদলে দুধ, চা, কফি সুগার ছাড়া বেছে নাও।" },
      { bullet: "ফলের জুসের বদলে গোটা ফল খাও।" },
      { bullet: "জিরো বা কম-ক্যালরি সুইটেনার ব্যবহার করে দেখো।" },
      { bullet: "খাবার কেনার সময় লেবেলে সুগার কনটেন্ট দেখার অভ্যাস গড়ে তোলো।" },
      { heading: "অ্যালকোহল সেবন সীমিত করো" },
      "ডায়াবেটিস থাকলে আর ওজন কমাতে চাইলে, অ্যালকোহল ইনটেক কমানো ভালো। সপ্তাহে সর্বোচ্চ ১৪ ইউনিট মেনে চলো, অথবা পুরুষদের ক্ষেত্রে দিনে দুই ড্রিংক আর নারীদের ক্ষেত্রে দিনে এক ড্রিংকে সীমিত রাখো। খালি পেটে অ্যালকোহল পান করা এড়িয়ে চলো, এতে হাইপোর ঝুঁকি থাকে।",
      { heading: "তোমার জন্য আরও ডায়েট টিপস" },
      { bullet: "সিদ্ধ, ভাপে রান্না বা পোচের মতো স্বাস্থ্যকর রান্নার পদ্ধতি বেছে নাও।" },
      { bullet: "নিয়মিত খাওয়ার অভ্যাস গড়ে তোলো — দিনে তিন বেলা খাবার আর তিনটা স্ন্যাক, এবং একই মিলে বেশি বা কম খাওয়া এড়িয়ে চলো।" },
      { bullet: "প্রতিদিন কী খাচ্ছ সেদিকে নজর রাখো। ফ্যাট, লবণ ও সুগারের পরিমাণে মনোযোগ দাও।" },
      { bullet: "তথাকথিত 'ডায়াবেটিক ফুড' নিয়ে অতিরিক্ত চিন্তিত হয়ো না। বৈজ্ঞানিকভাবে নিজের ডায়েট প্ল্যান তৈরি করো।" },
    ],
  },
  {
    id: "diet",
    title: "ডায়াবেটিসে ভালোভাবে খাওয়া",
    icon: Apple,
    color: COLORS.green,
    summary: "প্রতিদিনের ব্যবহারিক খাদ্যাভ্যাস।",
    body: [
      "ডায়াবেটিস নিয়ন্ত্রণের মূল বিষয় হলো রক্তে শর্করার মাত্রা স্থিতিশীল রাখা, হৃদযন্ত্রের সুস্বাস্থ্য রক্ষা করা এবং টেকসই, পুষ্টিকর অভ্যাস গড়ে তোলা। এখানে খাবার কীভাবে কার্যকরভাবে সাজানো যায় তার একটি ব্যবহারিক বিবরণ দেওয়া হলো।",
      { heading: "১. উচ্চ-ফাইবার ও লো-জিআই কার্বোহাইড্রেট" },
      "কার্বোহাইড্রেট সরাসরি রক্তের গ্লুকোজের উপর প্রভাব ফেলে, তবে সম্পূর্ণ, ফাইবার-সমৃদ্ধ উৎসগুলো ধীরে ধীরে শোষিত হয়, যা হঠাৎ শর্করা বেড়ে যাওয়া প্রতিরোধ করে।",
      { bullet: "প্রাধান্য দিন: স্টার্চবিহীন সবজি (পালং শাক, ব্রকলি, ক্যাপসিকাম), ডাল জাতীয় খাবার (মসুর ডাল, ছোলা, কালো শিম), গোটা শস্য (ওটস, লাল চাল, কুইনোয়া), এবং গোটা ফল (বেরি, আপেল)।" },
      { bullet: "সীমিত করুন: পরিশোধিত শস্য (সাদা রুটি, সাদা চাল, সাধারণ পাস্তা) এবং মিষ্টি পেস্ট্রি।" },
      { bullet: "ফল সম্পর্কে দ্রষ্টব্য: গোটা ফলে ফাইবারের পাশাপাশি প্রাকৃতিক চিনি থাকে, যা পানীয় বা মিষ্টিতে যোগ করা চিনির তুলনায় শরীর ভিন্নভাবে বিপাক করে।" },
      { heading: "২. চর্বিহীন প্রোটিন" },
      "প্রোটিন রক্তে শর্করা না বাড়িয়ে দীর্ঘক্ষণ পেট ভরা রাখতে সাহায্য করে।",
      { bullet: "সেরা বিকল্প: চামড়াবিহীন মুরগি, মাছ (বিশেষত চর্বিযুক্ত মাছ যেমন স্যামন, সার্ডিন, এবং ম্যাকারেল), ডিম, টোফু, এবং ডাল জাতীয় খাবার।" },
      { bullet: "সীমিত করুন: উচ্চ চর্বিযুক্ত, অতিরিক্ত প্রক্রিয়াজাত মাংস যেমন বেকন, হট ডগ, এবং সালামি।" },
      { heading: "৩. হৃদযন্ত্রের জন্য উপকারী অসম্পৃক্ত চর্বি" },
      "ডায়াবেটিসে হৃদরোগের ঝুঁকি বেশি থাকে বলে, স্যাচুরেটেড ফ্যাটের পরিবর্তে স্বাস্থ্যকর অসম্পৃক্ত চর্বি গ্রহণ দীর্ঘমেয়াদী হৃদযন্ত্রের সুস্থতায় সহায়তা করে।",
      { bullet: "প্রাধান্য দিন: এক্সট্রা-ভার্জিন অলিভ অয়েল, অ্যাভোকাডো, বীজ (চিয়া, ফ্ল্যাক্সসিড), এবং বাদাম।" },
      { bullet: "সীমিত করুন: উচ্চ চর্বিযুক্ত দুগ্ধজাত পণ্য, মাখন, পাম তেল, এবং ট্রান্স ফ্যাটযুক্ত ডিপ-ফ্রাইড খাবার।" },
    ],
  },
  {
    id: "testing",
    title: "বাসায় টেস্টিং",
    icon: TestTube2,
    color: COLORS.teal,
    summary: "হোম মিটার থেকে নির্ভরযোগ্য রিডিং পাওয়া।",
    body: [
      "টেস্টের আগে হাত ধুয়ে শুকিয়ে নাও — আঙুলে খাবারের অবশিষ্টাংশ থাকলে ভুলভাবে বেশি রিডিং আসতে পারে।",
      "কোন আঙুল ব্যবহার করছ তা পরিবর্তন করে আর আঙুলের পাশে প্রিক করলে সময়ের সাথে ব্যথা কমে।",
      "প্রতিটা রিডিং-এর context (খালি পেটে, খাওয়ার আগে, খাওয়ার পরে, ঘুমানোর আগে) লগ করলে শুধু সংখ্যার চেয়ে প্যাটার্ন অনেক বেশি কাজে লাগে।",
      "মিটার ও স্ট্রিপে কিছুটা error margin থাকে, তাই একটা অস্বাভাবিক রিডিং পেলে তাৎক্ষণিক react না করে আরেকবার চেক করে নেওয়া ভালো।",
    ],
  },
];

const INFO_ARTICLES_BY_LANG = { en: INFO_ARTICLES_EN, bn: INFO_ARTICLES_BN };

// ---------- UI text translations ----------
const T = {
  en: {
    nav: { tracker: "Tracker", history: "History", info: "Info", settings: "Settings" },
    tracker: {
      title: "Blood Sugar",
      recent: "Recent",
      avg3: "Avg (3d)",
      avg7: "Avg (7d)",
      trendHint: "Add a couple of readings to see your trend",
      emptyState: "No readings yet. Tap Add to log your first one.",
      addReading: "Add reading",
    },
    status: { Low: "Low", Normal: "Normal", Elevated: "Elevated", High: "High" },
    tags: { Default: "Default", Fasting: "Fasting", "Before meal": "Before meal", "After meal": "After meal", Bedtime: "Bedtime" },
    modal: {
      editReading: "Edit reading",
      newReading: "New reading",
      save: "Save",
      delete: "Delete",
    },
    info: {
      title: "Info & Knowledge",
      disclaimer:
        "General information only — always confirm personal targets and dietary changes with your own doctor or diabetes care team.",
    },
    settings: {
      title: "Settings",
      dataLives: "Your data lives on this device",
      exportBackup: "Export anytime to keep a backup",
      preferences: "Preferences",
      sugarTarget: "Sugar target range",
      unit: "Unit",
      language: "Language options",
      exportFile: "Export as file",
      more: "More",
      rateUs: "Rate us",
      shareFriends: "Share with friends",
      feedback: "Feedback",
      targetRange: "Target range",
      low: "Low",
      high: "High",
      saveRange: "Save range",
      chooseLanguage: "Choose language",
    },
    profile: {
      title: "Profile",
      switchProfile: "Switch profile",
      addProfile: "Add profile",
      renameProfile: "Rename profile",
      deleteProfile: "Delete profile",
      namePlaceholder: "e.g. Abbu, Amma, Rahim",
      create: "Create",
      saveName: "Save name",
      cancel: "Cancel",
      deleteConfirm: "Delete this profile and all its readings?",
      cannotDeleteLast: "You need at least one profile.",
      readingsCount: "readings",
    },
    history: {
      title: "History",
      range: "Range",
      d7: "7d",
      d14: "14d",
      d31: "31d",
      all: "All",
      colDate: "Date",
      colTime: "Time",
      colValue: "Value",
      colTag: "Tag",
      colStatus: "Status",
      noData: "No readings in this range yet.",
      exportCsv: "Export CSV",
      exportPdf: "Export PDF (last 31 days)",
      pdfNote: "PDF export always covers the most recent 31 days of readings.",
      reportTitle: "Blood Sugar Report",
      profileLabel: "Profile",
      rangeUsed: "Range",
      generatedOn: "Generated on",
      last31: "Last 31 days",
      totalReadings: "Total readings",
      close: "Close",
      preparing: "Preparing PDF…",
    },
  },
  bn: {
    nav: { tracker: "ট্র্যাকার", history: "হিস্ট্রি", info: "তথ্য", settings: "সেটিংস" },
    tracker: {
      title: "রক্তে শর্করা",
      recent: "সাম্প্রতিক",
      avg3: "গড় (৩ দিন)",
      avg7: "গড় (৭ দিন)",
      trendHint: "ট্রেন্ড দেখতে কয়েকটা রিডিং যোগ করো",
      emptyState: "এখনো কোনো রিডিং নেই। প্রথমটা লগ করতে Add-এ ট্যাপ করো।",
      addReading: "রিডিং যোগ করুন",
    },
    status: { Low: "কম", Normal: "স্বাভাবিক", Elevated: "বৃদ্ধি পাওয়া", High: "বেশি" },
    tags: { Default: "ডিফল্ট", Fasting: "খালি পেটে", "Before meal": "খাবারের আগে", "After meal": "খাবারের পরে", Bedtime: "ঘুমানোর আগে" },
    modal: {
      editReading: "রিডিং সম্পাদনা করুন",
      newReading: "নতুন রিডিং",
      save: "সংরক্ষণ করুন",
      delete: "মুছে ফেলুন",
    },
    info: {
      title: "তথ্য ও জ্ঞান",
      disclaimer:
        "শুধুমাত্র সাধারণ তথ্য — ব্যক্তিগত টার্গেট ও ডায়েট পরিবর্তনের ব্যাপারে সবসময় নিজের ডাক্তার বা ডায়াবেটিস কেয়ার টিমের সাথে নিশ্চিত হয়ে নাও।",
    },
    settings: {
      title: "সেটিংস",
      dataLives: "আপনার ডেটা এই ডিভাইসেই থাকে",
      exportBackup: "ব্যাকআপ রাখতে যেকোনো সময় এক্সপোর্ট করুন",
      preferences: "পছন্দসমূহ",
      sugarTarget: "সুগার টার্গেট রেঞ্জ",
      unit: "একক",
      language: "ভাষা",
      exportFile: "ফাইল হিসেবে এক্সপোর্ট করুন",
      more: "আরও",
      rateUs: "রেট করুন",
      shareFriends: "বন্ধুদের সাথে শেয়ার করুন",
      feedback: "মতামত",
      targetRange: "টার্গেট রেঞ্জ",
      low: "সর্বনিম্ন",
      high: "সর্বোচ্চ",
      saveRange: "রেঞ্জ সংরক্ষণ করুন",
      chooseLanguage: "ভাষা বেছে নিন",
    },
    profile: {
      title: "প্রোফাইল",
      switchProfile: "প্রোফাইল পরিবর্তন করুন",
      addProfile: "প্রোফাইল যোগ করুন",
      renameProfile: "নাম পরিবর্তন করুন",
      deleteProfile: "প্রোফাইল মুছে ফেলুন",
      namePlaceholder: "যেমন: আব্বু, আম্মা, রহিম",
      create: "তৈরি করুন",
      saveName: "নাম সংরক্ষণ করুন",
      cancel: "বাতিল",
      deleteConfirm: "এই প্রোফাইল আর এর সব রিডিং মুছে ফেলতে চাও?",
      cannotDeleteLast: "অন্তত একটা প্রোফাইল থাকতেই হবে।",
      readingsCount: "টা রিডিং",
    },
    history: {
      title: "হিস্ট্রি",
      range: "রেঞ্জ",
      d7: "৭ দিন",
      d14: "১৪ দিন",
      d31: "৩১ দিন",
      all: "সব",
      colDate: "তারিখ",
      colTime: "সময়",
      colValue: "মান",
      colTag: "ট্যাগ",
      colStatus: "অবস্থা",
      noData: "এই রেঞ্জে এখনো কোনো রিডিং নেই।",
      exportCsv: "CSV এক্সপোর্ট করুন",
      exportPdf: "PDF এক্সপোর্ট করুন (শেষ ৩১ দিন)",
      pdfNote: "PDF এক্সপোর্ট সবসময় সাম্প্রতিক ৩১ দিনের রিডিং কভার করে।",
      reportTitle: "ব্লাড সুগার রিপোর্ট",
      profileLabel: "প্রোফাইল",
      rangeUsed: "রেঞ্জ",
      generatedOn: "তৈরি হয়েছে",
      last31: "শেষ ৩১ দিন",
      totalReadings: "মোট রিডিং",
      close: "বন্ধ করুন",
      preparing: "PDF তৈরি হচ্ছে…",
    },
  },
};

function BottomNav({ tab, setTab, lang }) {
  const tr = T[lang];
  const items = [
    { id: "tracker", label: tr.nav.tracker, icon: Droplet },
    { id: "history", label: tr.nav.history, icon: HistoryIcon },
    { id: "info", label: tr.nav.info, icon: BookOpen },
    { id: "settings", label: tr.nav.settings, icon: SettingsIcon },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderTop: `1px solid ${COLORS.card2}`,
        background: COLORS.bg,
        padding: "8px 4px 10px",
      }}
    >
      {items.map((it) => {
        const active = tab === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "6px 0",
              cursor: "pointer",
              color: active ? COLORS.teal : COLORS.sub,
            }}
          >
            <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500 }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 18px 8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 28 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: COLORS.ink,
              cursor: "pointer",
              display: "flex",
              padding: 0,
            }}
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.ink, letterSpacing: 0.2 }}>
          {title}
        </span>
      </div>
      {right}
    </div>
  );
}

// ---------- Tracker tab ----------

function average(entries, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const inWindow = entries.filter((e) => e.ts >= cutoff);
  if (!inWindow.length) return null;
  return inWindow.reduce((a, e) => a + e.value, 0) / inWindow.length;
}

function Tracker({ entries, unit, addEntry, updateEntry, deleteEntry, target, lang, profileName }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const tr = T[lang];

  const sorted = useMemo(() => [...entries].sort((a, b) => a.ts - b.ts), [entries]);
  const recent = sorted[sorted.length - 1];
  const avg3 = average(entries, 3);
  const avg7 = average(entries, 7);

  const chartData = sorted.slice(-10).map((e) => ({
    label: new Date(e.ts).toLocaleTimeString(undefined, { hour: "numeric" }),
    value: unit === "mgdl" ? e.value : Number(toMmol(e.value).toFixed(1)),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar
        title={tr.tracker.title}
        right={
          <img
            src={LOGO_DATA_URI}
            alt="App logo"
            style={{ width: 30, height: 30, objectFit: "contain", borderRadius: 8, background: "#ffffff", padding: 3 }}
          />
        }
      />
      {profileName && (
        <div style={{ padding: "0 18px 10px", marginTop: -6 }}>
          <span
            style={{
              display: "inline-block",
              background: COLORS.card2,
              color: COLORS.teal,
              fontSize: 11.5,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            {profileName}
          </span>
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 18px 90px" }}>
        {/* Stat row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <Stat label={tr.tracker.recent} value={recent ? fmt(recent.value, unit) : "--"} unit={UNITS[unit]} />
          <Stat label={tr.tracker.avg3} value={avg3 ? fmt(avg3, unit) : "--"} unit={UNITS[unit]} />
          <Stat label={tr.tracker.avg7} value={avg7 ? fmt(avg7, unit) : "--"} unit={UNITS[unit]} />
        </div>

        {/* Chart */}
        <div
          style={{
            background: COLORS.card,
            borderRadius: 16,
            padding: "14px 8px 4px",
            marginBottom: 16,
          }}
        >
          {chartData.length > 1 ? (
            <div style={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 6, right: 10, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillTeal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.teal} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={COLORS.teal} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLORS.card2} vertical={false} />
                  <XAxis dataKey="label" stroke={COLORS.sub} fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke={COLORS.sub} fontSize={10} tickLine={false} axisLine={false} width={34} />
                  <Tooltip
                    contentStyle={{ background: COLORS.card2, border: "none", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: COLORS.sub }}
                  />
                  <Area type="monotone" dataKey="value" stroke={COLORS.teal} strokeWidth={2.5} fill="url(#fillTeal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.sub, fontSize: 13 }}>
              {tr.tracker.trendHint}
            </div>
          )}
        </div>

        {/* Entry list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.length === 0 && (
            <div style={{ color: COLORS.sub, textAlign: "center", padding: "24px 0", fontSize: 13 }}>
              {tr.tracker.emptyState}
            </div>
          )}
          {[...sorted].reverse().map((e) => {
            const st = statusFor(e.value);
            return (
              <div
                key={e.id}
                style={{
                  background: COLORS.card,
                  borderRadius: 14,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderLeft: `3px solid ${st.color}`,
                }}
              >
                <div style={{ minWidth: 64 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.ink, lineHeight: 1 }}>
                    {fmt(e.value, unit)}
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.sub }}>{UNITS[unit]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: st.color }}>
                    {tr.status[st.label]} · {tr.tags[e.tag] || e.tag}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.sub }}>{nowLabel(e.ts)}</div>
                </div>
                <button
                  onClick={() => setEditing(e)}
                  style={{ background: "none", border: "none", color: COLORS.sub, cursor: "pointer", padding: 4 }}
                >
                  <Pencil size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating add button */}
      <div style={{ position: "absolute", bottom: 78, left: 18, right: 18 }}>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            width: "100%",
            background: COLORS.teal,
            color: "#0c231f",
            border: "none",
            borderRadius: 14,
            padding: "13px 0",
            fontSize: 15,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
            boxShadow: "0 8px 20px -6px rgba(43,217,201,0.55)",
          }}
        >
          <Plus size={18} strokeWidth={3} /> {tr.tracker.addReading}
        </button>
      </div>

      {(showAdd || editing) && (
        <EntryModal
          unit={unit}
          lang={lang}
          initial={editing}
          onClose={() => {
            setShowAdd(false);
            setEditing(null);
          }}
          onSave={(entry) => {
            if (editing) updateEntry(editing.id, entry);
            else addEntry(entry);
            setShowAdd(false);
            setEditing(null);
          }}
          onDelete={
            editing
              ? () => {
                  deleteEntry(editing.id);
                  setEditing(null);
                }
              : null
          }
        />
      )}
    </div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div style={{ flex: 1, background: COLORS.card, borderRadius: 14, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, color: COLORS.sub, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.ink }}>
        {value} <span style={{ fontSize: 10, fontWeight: 500, color: COLORS.sub }}>{unit}</span>
      </div>
    </div>
  );
}

function EntryModal({ unit, initial, onClose, onSave, onDelete, lang }) {
  const [raw, setRaw] = useState(
    initial ? (unit === "mgdl" ? String(initial.value) : toMmol(initial.value).toFixed(1)) : ""
  );
  const [tag, setTag] = useState(initial ? initial.tag : "Default");
  const tags = ["Default", "Fasting", "Before meal", "After meal", "Bedtime"];
  const tr = T[lang];

  const submit = () => {
    const num = parseFloat(raw);
    if (isNaN(num) || num <= 0) return;
    const mgdl = unit === "mgdl" ? num : num * 18.0182;
    onSave({
      id: initial ? initial.id : "e" + Date.now(),
      value: mgdl,
      tag,
      ts: initial ? initial.ts : Date.now(),
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10,12,22,0.6)",
        display: "flex",
        alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          background: COLORS.card,
          borderRadius: "20px 20px 0 0",
          padding: "18px 20px 26px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink }}>
            {initial ? tr.modal.editReading : tr.modal.newReading}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.sub, cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 18 }}>
          <input
            autoFocus
            inputMode="decimal"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="0"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              borderBottom: `2px solid ${COLORS.card2}`,
              color: COLORS.ink,
              fontSize: 36,
              fontWeight: 800,
              padding: "4px 0",
              outline: "none",
            }}
          />
          <span style={{ color: COLORS.sub, fontSize: 15 }}>{UNITS[unit]}</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              style={{
                border: `1px solid ${tag === t ? COLORS.teal : COLORS.card2}`,
                background: tag === t ? "rgba(43,217,201,0.12)" : "transparent",
                color: tag === t ? COLORS.teal : COLORS.sub,
                borderRadius: 20,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {tr.tags[t]}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                background: "none",
                border: `1px solid ${COLORS.red}`,
                color: COLORS.red,
                borderRadius: 12,
                padding: "12px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <Trash2 size={15} /> {tr.modal.delete}
            </button>
          )}
          <button
            onClick={submit}
            style={{
              flex: 1,
              background: COLORS.teal,
              color: "#0c231f",
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {tr.modal.save}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Info tab ----------

function InfoTab({ lang }) {
  const [open, setOpen] = useState(null);
  const tr = T[lang];
  const INFO_ARTICLES = INFO_ARTICLES_BY_LANG[lang];

  if (open) {
    const art = INFO_ARTICLES.find((a) => a.id === open);
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <TopBar title={art.title} onBack={() => setOpen(null)} />
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 90px" }}>
          {art.body.map((p, i) =>
            typeof p === "object" && p.heading ? (
              <div
                key={i}
                style={{
                  display: "inline-block",
                  background: COLORS.tealDim,
                  border: `1px solid ${COLORS.teal}`,
                  color: COLORS.ink,
                  fontSize: 14,
                  fontWeight: 800,
                  padding: "8px 14px",
                  borderRadius: 6,
                  marginTop: i === 0 ? 0 : 6,
                  marginBottom: 12,
                }}
              >
                {p.heading}
              </div>
            ) : typeof p === "object" && p.bullet ? (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 10,
                  paddingLeft: 2,
                }}
              >
                <span style={{ color: COLORS.teal, fontSize: 14, lineHeight: 1.65 }}>•</span>
                <span style={{ color: COLORS.sub, fontSize: 14, lineHeight: 1.65 }}>{p.bullet}</span>
              </div>
            ) : (
              <p key={i} style={{ color: COLORS.sub, fontSize: 14, lineHeight: 1.65, marginBottom: 14 }}>
                {p}
              </p>
            )
          )}
          <div
            style={{
              background: COLORS.card,
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 12,
              color: COLORS.sub,
              marginTop: 8,
            }}
          >
            {tr.info.disclaimer}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={tr.info.title} />
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 18px 90px" }}>
        {INFO_ARTICLES.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => setOpen(a.id)}
              style={{
                width: "100%",
                textAlign: "left",
                background: a.color,
                border: "none",
                borderRadius: 14,
                padding: "14px 14px",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.24)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={19} color="#ffffff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#ffffff" }}>{a.title}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{a.summary}</div>
              </div>
              <ChevronRight size={16} color="rgba(255,255,255,0.85)" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Settings tab ----------

function Row({ icon: Icon, label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: "none",
        border: "none",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 4px",
        cursor: onClick ? "pointer" : "default",
        borderBottom: `1px solid ${COLORS.card2}`,
        textAlign: "left",
      }}
    >
      <Icon size={17} color={COLORS.ink} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: COLORS.ink }}>{label}</span>
      {value && <span style={{ fontSize: 13, color: COLORS.sub }}>{value}</span>}
      {onClick && <ChevronRight size={15} color={COLORS.sub} />}
    </button>
  );
}

function SettingsTab({
  unit,
  setUnit,
  target,
  setTarget,
  entries,
  lang,
  setLang,
  profiles,
  activeProfileId,
  switchProfile,
  addProfile,
  renameProfile,
  deleteProfile,
  activeProfileName,
}) {
  const [editingTarget, setEditingTarget] = useState(false);
  const [pickingLang, setPickingLang] = useState(false);
  const [pickingProfile, setPickingProfile] = useState(false);
  const [addingProfile, setAddingProfile] = useState(false);
  const [renamingProfile, setRenamingProfile] = useState(null);
  const [nameDraft, setNameDraft] = useState("");
  const [low, setLow] = useState(target.low);
  const [high, setHigh] = useState(target.high);
  const tr = T[lang];

  const exportFile = useCallback(() => {
    const safeName = activeProfileName.replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, "-").replace(/^-+|-+$/g, "") || "profile";
    const header = `Profile: ${activeProfileName}\ndate,time,value_mgdl,value_mmol,status\n`;
    const rows = entries
      .slice()
      .sort((a, b) => a.ts - b.ts)
      .map((e) => {
        const d = new Date(e.ts);
        let status;
        if (e.value < 70) status = "Low";
        else if (e.value <= 140) status = "Normal";
        else status = "High";
        return [
          d.toLocaleDateString(),
          d.toLocaleTimeString(),
          Math.round(e.value),
          toMmol(e.value).toFixed(1),
          status,
        ].join(",");
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blood-sugar-log-${safeName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entries, activeProfileName]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={tr.settings.title} />
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 90px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: COLORS.card,
            borderRadius: 14,
            padding: "16px",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: COLORS.tealDim,
              border: `1px solid ${COLORS.teal}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.teal }}>
              {(activeProfileName || "?").trim().charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.ink }}>{activeProfileName}</div>
            <div style={{ fontSize: 11.5, color: COLORS.sub }}>{tr.settings.exportBackup}</div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: COLORS.sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {tr.profile.title}
        </div>
        <div style={{ marginBottom: 18 }}>
          <Row
            icon={SettingsIcon}
            label={activeProfileName}
            value={`${profiles.length} ${lang === "bn" ? "" : "profiles"}`}
            onClick={() => setPickingProfile(true)}
          />
        </div>

        <div style={{ fontSize: 11, color: COLORS.sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {tr.settings.preferences}
        </div>
        <div style={{ marginBottom: 18 }}>
          <Row
            icon={Target}
            label={tr.settings.sugarTarget}
            value={`${fmt(low, unit)}–${fmt(high, unit)} ${UNITS[unit]}`}
            onClick={() => setEditingTarget(true)}
          />
          <Row
            icon={Ruler}
            label={tr.settings.unit}
            value={UNITS[unit]}
            onClick={() => setUnit(unit === "mgdl" ? "mmol" : "mgdl")}
          />
          <Row
            icon={Globe}
            label={tr.settings.language}
            value={lang === "bn" ? "বাংলা" : "English"}
            onClick={() => setPickingLang(true)}
          />
          <Row icon={Download} label={tr.settings.exportFile} onClick={exportFile} />
        </div>

        <div style={{ fontSize: 11, color: COLORS.sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {tr.settings.more}
        </div>
        <div>
          <Row icon={Star} label={tr.settings.rateUs} />
          <Row icon={Share2} label={tr.settings.shareFriends} />
          <Row icon={Pencil} label={tr.settings.feedback} />
        </div>
      </div>

      {/* Profile switcher sheet */}
      {pickingProfile && (
        <div
          style={{ position: "absolute", inset: 0, background: "rgba(10,12,22,0.6)", display: "flex", alignItems: "flex-end" }}
          onClick={() => setPickingProfile(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", background: COLORS.card, borderRadius: "20px 20px 0 0", padding: "18px 20px 26px", maxHeight: "70vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink }}>{tr.profile.switchProfile}</span>
              <button onClick={() => setPickingProfile(false)} style={{ background: "none", border: "none", color: COLORS.sub, cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {profiles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: `1px solid ${p.id === activeProfileId ? COLORS.teal : COLORS.card2}`,
                    background: p.id === activeProfileId ? "rgba(43,217,201,0.12)" : "transparent",
                    borderRadius: 12,
                    padding: "6px 6px 6px 16px",
                  }}
                >
                  <button
                    onClick={() => {
                      switchProfile(p.id);
                      setPickingProfile(false);
                    }}
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      padding: "7px 0",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: p.id === activeProfileId ? COLORS.teal : COLORS.ink }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.sub }}>{p.entries.length} {tr.profile.readingsCount}</div>
                  </button>
                  <button
                    onClick={() => {
                      setNameDraft(p.name);
                      setRenamingProfile(p.id);
                    }}
                    style={{ background: "none", border: "none", color: COLORS.sub, cursor: "pointer", padding: 8 }}
                  >
                    <Pencil size={15} />
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={() => deleteProfile(p.id)}
                      style={{ background: "none", border: "none", color: COLORS.red, cursor: "pointer", padding: 8 }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setNameDraft("");
                setAddingProfile(true);
              }}
              style={{
                width: "100%",
                background: "none",
                border: `1px dashed ${COLORS.teal}`,
                color: COLORS.teal,
                borderRadius: 12,
                padding: "12px 0",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Plus size={16} /> {tr.profile.addProfile}
            </button>
          </div>
        </div>
      )}

      {/* Add profile name sheet */}
      {addingProfile && (
        <div
          style={{ position: "absolute", inset: 0, background: "rgba(10,12,22,0.7)", display: "flex", alignItems: "flex-end" }}
          onClick={() => setAddingProfile(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", background: COLORS.card, borderRadius: "20px 20px 0 0", padding: "18px 20px 26px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink }}>{tr.profile.addProfile}</span>
              <button onClick={() => setAddingProfile(false)} style={{ background: "none", border: "none", color: COLORS.sub, cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder={tr.profile.namePlaceholder}
              style={{
                width: "100%",
                background: COLORS.card2,
                border: "none",
                borderRadius: 10,
                padding: "12px 14px",
                color: COLORS.ink,
                fontSize: 15,
                fontWeight: 600,
                outline: "none",
                marginBottom: 18,
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => {
                const name = nameDraft.trim();
                if (!name) return;
                addProfile(name);
                setAddingProfile(false);
              }}
              style={{ width: "100%", background: COLORS.teal, color: "#0c231f", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 800, fontSize: 14, cursor: "pointer" }}
            >
              {tr.profile.create}
            </button>
          </div>
        </div>
      )}

      {/* Rename profile sheet */}
      {renamingProfile && (
        <div
          style={{ position: "absolute", inset: 0, background: "rgba(10,12,22,0.7)", display: "flex", alignItems: "flex-end" }}
          onClick={() => setRenamingProfile(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", background: COLORS.card, borderRadius: "20px 20px 0 0", padding: "18px 20px 26px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink }}>{tr.profile.renameProfile}</span>
              <button onClick={() => setRenamingProfile(null)} style={{ background: "none", border: "none", color: COLORS.sub, cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder={tr.profile.namePlaceholder}
              style={{
                width: "100%",
                background: COLORS.card2,
                border: "none",
                borderRadius: 10,
                padding: "12px 14px",
                color: COLORS.ink,
                fontSize: 15,
                fontWeight: 600,
                outline: "none",
                marginBottom: 18,
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => {
                const name = nameDraft.trim();
                if (!name) return;
                renameProfile(renamingProfile, name);
                setRenamingProfile(null);
              }}
              style={{ width: "100%", background: COLORS.teal, color: "#0c231f", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 800, fontSize: 14, cursor: "pointer" }}
            >
              {tr.profile.saveName}
            </button>
          </div>
        </div>
      )}

      {pickingLang && (
        <div
          style={{ position: "absolute", inset: 0, background: "rgba(10,12,22,0.6)", display: "flex", alignItems: "flex-end" }}
          onClick={() => setPickingLang(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", background: COLORS.card, borderRadius: "20px 20px 0 0", padding: "18px 20px 26px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink }}>{tr.settings.chooseLanguage}</span>
              <button onClick={() => setPickingLang(false)} style={{ background: "none", border: "none", color: COLORS.sub, cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { code: "en", label: "English" },
                { code: "bn", label: "বাংলা (Bangla)" },
              ].map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => {
                    setLang(opt.code);
                    setPickingLang(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: `1px solid ${lang === opt.code ? COLORS.teal : COLORS.card2}`,
                    background: lang === opt.code ? "rgba(43,217,201,0.12)" : "transparent",
                    color: lang === opt.code ? COLORS.teal : COLORS.ink,
                    borderRadius: 12,
                    padding: "13px 16px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {editingTarget && (
        <div
          style={{ position: "absolute", inset: 0, background: "rgba(10,12,22,0.6)", display: "flex", alignItems: "flex-end" }}
          onClick={() => setEditingTarget(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", background: COLORS.card, borderRadius: "20px 20px 0 0", padding: "18px 20px 26px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink }}>{tr.settings.targetRange}</span>
              <button onClick={() => setEditingTarget(false)} style={{ background: "none", border: "none", color: COLORS.sub, cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.sub, marginBottom: 6 }}>{tr.settings.low} ({UNITS[unit]})</div>
                <input
                  value={fmt(low, unit)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    setLow(unit === "mgdl" ? v : v * 18.0182);
                  }}
                  style={{ width: "100%", background: COLORS.card2, border: "none", borderRadius: 10, padding: "10px 12px", color: COLORS.ink, fontSize: 16, fontWeight: 700, outline: "none" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.sub, marginBottom: 6 }}>{tr.settings.high} ({UNITS[unit]})</div>
                <input
                  value={fmt(high, unit)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    setHigh(unit === "mgdl" ? v : v * 18.0182);
                  }}
                  style={{ width: "100%", background: COLORS.card2, border: "none", borderRadius: 10, padding: "10px 12px", color: COLORS.ink, fontSize: 16, fontWeight: 700, outline: "none" }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setTarget({ low, high });
                setEditingTarget(false);
              }}
              style={{ width: "100%", background: COLORS.teal, color: "#0c231f", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 800, fontSize: 14, cursor: "pointer" }}
            >
              {tr.settings.saveRange}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- History tab ----------

function buildCsv(rows, unit, profileName) {
  const header = `Profile: ${profileName}\ndate,time,value_mgdl,value_mmol,tag,status\n`;
  const body = rows
    .slice()
    .sort((a, b) => a.ts - b.ts)
    .map((e) => {
      const d = new Date(e.ts);
      const st = statusFor(e.value).label;
      return [
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        Math.round(e.value),
        toMmol(e.value).toFixed(1),
        e.tag,
        st,
      ].join(",");
    })
    .join("\n");
  return header + body;
}

function downloadBlob(content, type, filename) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function safeFileToken(name) {
  return (
    name.replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, "-").replace(/^-+|-+$/g, "") || "profile"
  );
}

function HistoryTab({ entries, unit, lang, profileName }) {
  const tr = T[lang].history;
  const trStatus = T[lang].status;
  const trTags = T[lang].tags;
  const [range, setRange] = useState(31);
  const [printing, setPrinting] = useState(false);
  const printAreaId = useMemo(
    () => "bs-print-area-" + Math.random().toString(36).slice(2),
    []
  );

  useEffect(() => {
    if (!printing) return;
    const t = setTimeout(() => {
      window.print();
    }, 150);
    const onAfterPrint = () => setPrinting(false);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, [printing]);

  const now = Date.now();

  const filtered = useMemo(() => {
    let list = entries.slice();
    if (range) {
      const cutoff = now - range * 24 * 60 * 60 * 1000;
      list = list.filter((e) => e.ts >= cutoff);
    }
    return list.sort((a, b) => b.ts - a.ts);
  }, [entries, range]);

  const last31 = useMemo(() => {
    const cutoff = now - 31 * 24 * 60 * 60 * 1000;
    return entries.filter((e) => e.ts >= cutoff).sort((a, b) => a.ts - b.ts);
  }, [entries]);

  const rangeChips = [
    { id: 7, label: tr.d7 },
    { id: 14, label: tr.d14 },
    { id: 31, label: tr.d31 },
    { id: null, label: tr.all },
  ];

  const exportCsv = () => {
    const token = safeFileToken(profileName || "profile");
    const rangeToken = range ? `${range}d` : "all";
    downloadBlob(
      buildCsv(filtered, unit, profileName || ""),
      "text/csv",
      `blood-sugar-history-${token}-${rangeToken}.csv`
    );
  };

  const exportPdf = () => {
    setPrinting(true);
  };

  const printRows = last31;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={tr.title} />
      {profileName && (
        <div style={{ padding: "0 18px 8px", marginTop: -6 }}>
          <span
            style={{
              display: "inline-block",
              background: COLORS.card2,
              color: COLORS.teal,
              fontSize: 11.5,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            {profileName}
          </span>
        </div>
      )}
      <div style={{ padding: "0 18px 10px" }}>
        <div style={{ fontSize: 11, color: COLORS.sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {tr.range}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {rangeChips.map((c) => (
            <button
              key={String(c.id)}
              onClick={() => setRange(c.id)}
              style={{
                border: `1px solid ${range === c.id ? COLORS.teal : COLORS.card2}`,
                background: range === c.id ? "rgba(43,217,201,0.12)" : "transparent",
                color: range === c.id ? COLORS.teal : COLORS.sub,
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 18px 200px" }}>
        {filtered.length === 0 ? (
          <div style={{ color: COLORS.sub, textAlign: "center", padding: "24px 0", fontSize: 13 }}>
            {tr.noData}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((e) => {
              const st = statusFor(e.value);
              const d = new Date(e.ts);
              return (
                <div
                  key={e.id}
                  style={{
                    background: COLORS.card,
                    borderRadius: 12,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderLeft: `3px solid ${st.color}`,
                  }}
                >
                  <div style={{ minWidth: 74 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink }}>
                      {d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                    <div style={{ fontSize: 10.5, color: COLORS.sub }}>
                      {d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink }}>
                      {fmt(e.value, unit)} <span style={{ fontSize: 10, color: COLORS.sub, fontWeight: 500 }}>{UNITS[unit]}</span>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.sub }}>{trTags[e.tag] || e.tag}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: st.color }}>
                    {trStatus[st.label]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 78, left: 18, right: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={exportCsv}
            style={{
              flex: 1,
              background: COLORS.card2,
              color: COLORS.ink,
              border: "none",
              borderRadius: 14,
              padding: "12px 0",
              fontSize: 13,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <Download size={15} /> {tr.exportCsv}
          </button>
          <button
            onClick={exportPdf}
            style={{
              flex: 1,
              background: COLORS.teal,
              color: "#0c231f",
              border: "none",
              borderRadius: 14,
              padding: "12px 0",
              fontSize: 13,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
              boxShadow: "0 8px 20px -6px rgba(43,217,201,0.55)",
            }}
          >
            <Printer size={15} /> {tr.exportPdf}
          </button>
        </div>
        <div style={{ fontSize: 10.5, color: COLORS.sub, textAlign: "center" }}>{tr.pdfNote}</div>
      </div>

      {printing && (
        <div
          className={printAreaId}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            overflowY: "auto",
            fontFamily: "'Inter', -apple-system, 'Segoe UI', sans-serif",
            color: "#111",
            background: "#fff",
            padding: "28px 32px",
          }}
        >
          <style>{`
            @media print {
              body * { visibility: hidden; }
              .${printAreaId}, .${printAreaId} * { visibility: visible; }
              .${printAreaId} { position: fixed; inset: 0; padding: 24px 28px; }
              .${printAreaId} .no-print { display: none !important; }
            }
          `}</style>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <img src={LOGO_DATA_URI} alt="logo" style={{ width: 34, height: 34 }} />
            <div style={{ fontSize: 20, fontWeight: 800 }}>{tr.reportTitle}</div>
          </div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 18, lineHeight: 1.6 }}>
            {profileName && <div>{tr.profileLabel}: <strong>{profileName}</strong></div>}
            <div>{tr.rangeUsed}: <strong>{tr.last31}</strong></div>
            <div>{tr.totalReadings}: <strong>{printRows.length}</strong></div>
            <div>{tr.generatedOn}: <strong>{new Date().toLocaleString()}</strong></div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {[tr.colDate, tr.colTime, tr.colValue, tr.colTag, tr.colStatus].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      borderBottom: "2px solid #333",
                      padding: "6px 8px",
                      fontSize: 11.5,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {printRows.map((e) => {
                const d = new Date(e.ts);
                const st = statusFor(e.value);
                return (
                  <tr key={e.id} style={{ breakInside: "avoid" }}>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>
                      {d.toLocaleDateString()}
                    </td>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>
                      {d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>
                      {fmt(e.value, unit)} {UNITS[unit]}
                    </td>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>
                      {trTags[e.tag] || e.tag}
                    </td>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid #ddd" }}>
                      {trStatus[st.label]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="no-print"
            onClick={() => setPrinting(false)}
            style={{
              marginTop: 16,
              background: "#eee",
              color: "#111",
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {tr.close}
          </button>
        </div>
      )}
    </div>
  );
}

const STORAGE_KEY = "bs-tracker-state";

// Works inside the Claude artifact preview (window.storage) AND in a
// standalone build (Vite/Capacitor), where it falls back to localStorage.
const persist = {
  async get(key) {
    if (typeof window !== "undefined" && window.storage && window.storage.get) {
      return window.storage.get(key);
    }
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? { key, value: raw } : null;
    } catch (e) {
      return null;
    }
  },
  async set(key, value) {
    if (typeof window !== "undefined" && window.storage && window.storage.set) {
      return window.storage.set(key, value);
    }
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* ignore quota errors */
    }
  },
};

// ---------- Root ----------

function makeDefaultProfile() {
  return {
    id: "p-" + Date.now(),
    name: "Default",
    entries: SEED,
    unit: "mgdl",
    target: { low: 70, high: 140 },
  };
}

export default function App() {
  const [tab, setTab] = useState("tracker");
  const [profiles, setProfiles] = useState([makeDefaultProfile()]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [lang, setLang] = useState("en");
  const [ready, setReady] = useState(false);

  // Load persisted state once
  useEffect(() => {
    (async () => {
      try {
        const saved = await persist.get(STORAGE_KEY);
        if (saved && saved.value) {
          const parsed = JSON.parse(saved.value);
          if (parsed.lang) setLang(parsed.lang);

          if (Array.isArray(parsed.profiles) && parsed.profiles.length) {
            setProfiles(parsed.profiles);
            setActiveProfileId(parsed.activeProfileId || parsed.profiles[0].id);
          } else if (parsed.entries) {
            // migrate legacy single-profile data
            const migrated = {
              id: "p-" + Date.now(),
              name: "Default",
              entries: parsed.entries,
              unit: parsed.unit || "mgdl",
              target: parsed.target || { low: 70, high: 140 },
            };
            setProfiles([migrated]);
            setActiveProfileId(migrated.id);
          } else {
            const def = makeDefaultProfile();
            setProfiles([def]);
            setActiveProfileId(def.id);
          }
        } else {
          const def = makeDefaultProfile();
          setProfiles([def]);
          setActiveProfileId(def.id);
        }
      } catch (err) {
        const def = makeDefaultProfile();
        setProfiles([def]);
        setActiveProfileId(def.id);
      }
      setReady(true);
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    if (!ready) return;
    persist
      .set(STORAGE_KEY, JSON.stringify({ profiles, activeProfileId, lang }))
      .catch(() => {});
  }, [profiles, activeProfileId, lang, ready]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const updateActiveProfile = (updater) => {
    setProfiles((prev) => prev.map((p) => (p.id === activeProfile.id ? updater(p) : p)));
  };

  const addEntry = (e) => updateActiveProfile((p) => ({ ...p, entries: [...p.entries, e] }));
  const updateEntry = (id, e) =>
    updateActiveProfile((p) => ({ ...p, entries: p.entries.map((x) => (x.id === id ? e : x)) }));
  const deleteEntry = (id) =>
    updateActiveProfile((p) => ({ ...p, entries: p.entries.filter((x) => x.id !== id) }));
  const setUnit = (unit) => updateActiveProfile((p) => ({ ...p, unit }));
  const setTarget = (target) => updateActiveProfile((p) => ({ ...p, target }));

  const switchProfile = (id) => setActiveProfileId(id);

  const addProfile = (name) => {
    const p = { id: "p-" + Date.now(), name, entries: [], unit: "mgdl", target: { low: 70, high: 140 } };
    setProfiles((prev) => [...prev, p]);
    setActiveProfileId(p.id);
  };

  const renameProfile = (id, name) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const deleteProfile = (id) => {
    setProfiles((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((p) => p.id !== id);
      if (activeProfileId === id) {
        setActiveProfileId(next[0].id);
      }
      return next;
    });
  };

  if (!activeProfile) return null;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, 'Segoe UI', sans-serif",
        width: "100%",
        maxWidth: 480,
        height: "100vh",
        margin: "0 auto",
        background: COLORS.bg,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {tab === "tracker" && (
          <Tracker
            entries={activeProfile.entries}
            unit={activeProfile.unit}
            addEntry={addEntry}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
            target={activeProfile.target}
            lang={lang}
            profileName={profiles.length > 1 ? activeProfile.name : null}
          />
        )}
        {tab === "history" && (
          <HistoryTab
            entries={activeProfile.entries}
            unit={activeProfile.unit}
            lang={lang}
            profileName={activeProfile.name}
          />
        )}
        {tab === "info" && <InfoTab lang={lang} />}
        {tab === "settings" && (
          <SettingsTab
            unit={activeProfile.unit}
            setUnit={setUnit}
            target={activeProfile.target}
            setTarget={setTarget}
            entries={activeProfile.entries}
            lang={lang}
            setLang={setLang}
            profiles={profiles}
            activeProfileId={activeProfile.id}
            activeProfileName={activeProfile.name}
            switchProfile={switchProfile}
            addProfile={addProfile}
            renameProfile={renameProfile}
            deleteProfile={deleteProfile}
          />
        )}
      </div>
      <BottomNav tab={tab} setTab={setTab} lang={lang} />
    </div>
  );
}
