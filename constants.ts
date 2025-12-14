import { FoodItem } from './types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const DEFAULT_FOODS: string[] = [
  "麻辣烫", "火锅", "肯德基", "麦当劳", "沙县小吃", "兰州拉面", 
  "黄焖鸡米饭", "盖浇饭", "炒面", "炒饭", "烧烤", "麻辣香锅", 
  "酸菜鱼", "烤肉", "日料", "寿司", "汉堡王", "必胜客", 
  "披萨", "炸鸡", "米线", "螺蛳粉", "凉皮", "肉夹馍", 
  "羊肉汤", "牛肉汤", "冒菜", "串串香", "自助餐", "大排档", 
  "西餐", "牛排", "意面", "轻食", "沙拉", "过桥米线",
  "新疆菜", "东北菜", "川菜", "湘菜", "粤菜", "本帮菜", 
  "杭帮菜", "快餐", "面包", "蛋糕", "咖啡", "奶茶"
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = DEFAULT_FOODS.map(name => ({
  id: generateId(),
  name,
  active: true
}));