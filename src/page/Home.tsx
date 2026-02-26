import React, { useState } from "react";
import {
  Button,
  Card,
  Tag,
  Space,
  Modal,
  Toast,
  Tabs,
  Badge,
} from "antd-mobile";
import { CloseCircleOutline } from "antd-mobile-icons";
import { foods, FoodItem } from "../data/food";
import FoodRecommender from "../components/FoodRecommender";
import "./Home.css";

const Home: React.FC = () => {
  // 全体抽奖状态
  const [globalFood, setGlobalFood] = useState<FoodItem | null>(null);
  const [isGlobalSpinning, setIsGlobalSpinning] = useState(false);
  const [globalMealType, setGlobalMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "all"
  >("all");

  // 自定义抽奖状态
  const [customFood, setCustomFood] = useState<FoodItem | null>(null);
  const [isCustomSpinning, setIsCustomSpinning] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState<FoodItem[]>([]);

  // 通用状态
  const [showRecipe, setShowRecipe] = useState(false);
  const [showDishDetail, setShowDishDetail] = useState<FoodItem | null>(null);
  const [activeTab, setActiveTab] = useState("global");

  const getCookingTimeTag = (time: string) => {
    const config = {
      fast: { color: "success", text: "快速" },
      medium: { color: "primary", text: "适中" },
      slow: { color: "warning", text: "慢工" },
    };
    const item = config[time as keyof typeof config];
    return <Tag color={item.color}>{item.text}</Tag>;
  };

  const getDifficultyTag = (difficulty: string) => {
    const config = {
      easy: { color: "success", text: "简单" },
      medium: { color: "primary", text: "中等" },
      hard: { color: "danger", text: "复杂" },
    };
    const item = config[difficulty as keyof typeof config];
    return <Tag color={item.color}>{item.text}</Tag>;
  };

  // ========== 全体抽奖逻辑 ==========
  const spinGlobalWheel = () => {
    setIsGlobalSpinning(true);

    // 根据选择的餐型过滤菜品
    let filteredFoods = foods;
    if (globalMealType !== "all") {
      filteredFoods = foods.filter(
        (f: { category: string }) =>
          f.category === globalMealType || f.category === "both",
      );
    }

    if (filteredFoods.length === 0) {
      Toast.show({
        icon: "fail",
        content: "该时段暂无推荐菜品",
      });
      setIsGlobalSpinning(false);
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredFoods.length);
      setGlobalFood(filteredFoods[randomIndex]);
      count++;

      if (count > 15) {
        clearInterval(interval);
        setIsGlobalSpinning(false);

        Toast.show({
          icon: "success",
          content: "今天吃这个！",
        });
      }
    }, 100);
  };

  // ========== 自定义抽奖逻辑 ==========
  const spinCustomWheel = () => {
    if (selectedDishes.length === 0) {
      Toast.show({
        icon: "fail",
        content: "请先在推荐页面添加菜品到抽奖池",
      });
      return;
    }

    setIsCustomSpinning(true);

    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * selectedDishes.length);
      setCustomFood(selectedDishes[randomIndex]);
      count++;

      if (count > 15) {
        clearInterval(interval);
        setIsCustomSpinning(false);

        Toast.show({
          icon: "success",
          content: "今天吃这个！",
        });
      }
    }, 100);
  };

  const addToLottery = (dish: FoodItem) => {
    if (!selectedDishes.find((d) => d.id === dish.id)) {
      setSelectedDishes([...selectedDishes, dish]);
      Toast.show({
        icon: "success",
        content: `已添加 ${dish.name} 到自定义抽奖池`,
      });
    }
  };

  const removeFromLottery = (dishId: string) => {
    setSelectedDishes(selectedDishes.filter((d) => d.id !== dishId));
    if (customFood?.id === dishId) {
      setCustomFood(null);
    }
  };

  const clearLottery = () => {
    setSelectedDishes([]);
    setCustomFood(null);
    Toast.show({
      icon: "success",
      content: "已清空自定义抽奖池",
    });
  };

  return (
    <div className="home-container">
      <div className="header">
        <h1>🍚 今天吃什么？</h1>
        <p className="subtitle">全体随机 | 自定义抽奖</p>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* ========== 全体抽奖Tab ========== */}
        <Tabs.Tab title="🎲 全体随机" key="global">
          <Card className="meal-selector">
            <div className="meal-buttons">
              <Button
                color={globalMealType === "all" ? "primary" : "default"}
                onClick={() => setGlobalMealType("all")}
                size="middle"
                className="meal-btn"
              >
                🎯 全部
              </Button>
              <Button
                color={globalMealType === "breakfast" ? "primary" : "default"}
                onClick={() => setGlobalMealType("breakfast")}
                size="middle"
                className="meal-btn"
              >
                🌅 早餐
              </Button>
              <Button
                color={globalMealType === "lunch" ? "primary" : "default"}
                onClick={() => setGlobalMealType("lunch")}
                size="middle"
                className="meal-btn"
              >
                🌞 午餐
              </Button>
              <Button
                color={globalMealType === "dinner" ? "primary" : "default"}
                onClick={() => setGlobalMealType("dinner")}
                size="middle"
                className="meal-btn"
              >
                🌙 晚餐
              </Button>
            </div>
          </Card>

          <Button
            block
            size="large"
            color="primary"
            onClick={spinGlobalWheel}
            disabled={isGlobalSpinning}
            loading={isGlobalSpinning}
            className="spin-button"
          >
            {isGlobalSpinning ? "转盘中..." : "🎲 全体随机抽奖"}
          </Button>

          {globalFood && (
            <Card className="result-card">
              <h2 className="food-name">{globalFood.name}</h2>
              <div className="tags-container">
                {getCookingTimeTag(globalFood.cookingTime)}
                {getDifficultyTag(globalFood.difficulty)}
                <Tag color="primary">{globalFood.cuisine}</Tag>
                <Tag
                  color={globalFood.category === "both" ? "primary" : "success"}
                >
                  {globalFood.category === "breakfast"
                    ? "早餐"
                    : globalFood.category === "lunch"
                      ? "午餐"
                      : globalFood.category === "dinner"
                        ? "晚餐"
                        : "通用"}
                </Tag>
              </div>
              <div className="ingredients">
                <strong>食材：</strong> {globalFood.ingredients.join("、")}
              </div>
              {globalFood.description && (
                <div className="description">{globalFood.description}</div>
              )}
              {globalFood.recipe && (
                <Button
                  block
                  size="small"
                  onClick={() => setShowRecipe(true)}
                  style={
                    {
                      color: "#333333",
                      marginTop: "15px",
                    } as React.CSSProperties
                  }
                >
                  📖 查看做法
                </Button>
              )}
            </Card>
          )}
        </Tabs.Tab>

        {/* ========== 自定义抽奖Tab ========== */}
        <Tabs.Tab title="🎯 自定义抽奖" key="custom">
          <Card className="lottery-pool">
            <div className="pool-header">
              <span>我的抽奖池 ({selectedDishes.length}个菜品)</span>
              {selectedDishes.length > 0 && (
                <Button
                  size="small"
                  color="danger"
                  fill="none"
                  onClick={clearLottery}
                >
                  清空
                </Button>
              )}
            </div>
            {selectedDishes.length > 0 ? (
              <Space wrap className="pool-items">
                {selectedDishes.map((dish) => (
                  <Badge
                    key={dish.id}
                    content={
                      <CloseCircleOutline
                        className="remove-icon"
                        onClick={() => removeFromLottery(dish.id)}
                      />
                    }
                  >
                    <Tag color="primary">{dish.name}</Tag>
                  </Badge>
                ))}
              </Space>
            ) : (
              <div className="empty-pool">
                <div>暂无菜品</div>
                <div className="empty-pool-tip">请切换到"推荐"页面添加菜品</div>
              </div>
            )}
          </Card>

          <Button
            block
            size="large"
            color="primary"
            onClick={spinCustomWheel}
            disabled={isCustomSpinning || selectedDishes.length === 0}
            loading={isCustomSpinning}
            className="spin-button custom-spin"
          >
            {isCustomSpinning ? "转盘中..." : "🎯 从我的抽奖池抽取"}
          </Button>

          {customFood && (
            <Card className="result-card">
              <h2 className="food-name">{customFood.name}</h2>
              <div className="tags-container">
                {getCookingTimeTag(customFood.cookingTime)}
                {getDifficultyTag(customFood.difficulty)}
                <Tag color="primary">{customFood.cuisine}</Tag>
              </div>
              <div className="ingredients">
                <strong>食材：</strong> {customFood.ingredients.join("、")}
              </div>
              {customFood.recipe && (
                <Button
                  block
                  color="default"
                  size="small"
                  onClick={() => setShowRecipe(true)}
                  style={
                    {
                      color: "#333333",
                      marginTop: "15px",
                    } as React.CSSProperties
                  }
                >
                  📖 查看做法
                </Button>
              )}
            </Card>
          )}
        </Tabs.Tab>

        {/* ========== 推荐添加Tab ========== */}
        <Tabs.Tab title="🔍 推荐添加" key="recommend">
          <FoodRecommender
            onSelectDish={(dish) => setShowDishDetail(dish)}
            onAddToLottery={addToLottery}
            selectedDishes={selectedDishes}
          />
        </Tabs.Tab>
      </Tabs>

      {/* 菜品详情弹窗 */}
      <Modal
        visible={!!showDishDetail}
        title={showDishDetail?.name}
        closeOnMaskClick
        onClose={() => setShowDishDetail(null)}
        content={
          showDishDetail && (
            <div className="dish-detail">
              <div className="detail-section">
                <Tag color="success">
                  {showDishDetail.cookingTime === "fast"
                    ? "快速"
                    : showDishDetail.cookingTime === "medium"
                      ? "适中"
                      : "慢工"}
                </Tag>
                <Tag color="warning">
                  {showDishDetail.difficulty === "easy"
                    ? "简单"
                    : showDishDetail.difficulty === "medium"
                      ? "中等"
                      : "复杂"}
                </Tag>
                <Tag color="primary">{showDishDetail.cuisine}</Tag>
              </div>
              <div className="detail-section">
                <strong>食材：</strong> {showDishDetail.ingredients.join("、")}
              </div>
              {showDishDetail.tags && (
                <div className="detail-section">
                  <strong>标签：</strong> {showDishDetail.tags.join("、")}
                </div>
              )}
              {showDishDetail.description && (
                <div className="detail-section">
                  <strong>描述：</strong> {showDishDetail.description}
                </div>
              )}
              {showDishDetail.recipe && (
                <div className="detail-section">
                  <strong>做法：</strong>
                  <div className="recipe-text">{showDishDetail.recipe}</div>
                </div>
              )}
              <Button
                block
                color="primary"
                onClick={() => {
                  addToLottery(showDishDetail);
                  setShowDishDetail(null);
                }}
                disabled={selectedDishes.some(
                  (d) => d.id === showDishDetail.id,
                )}
              >
                {selectedDishes.some((d) => d.id === showDishDetail.id)
                  ? "已在抽奖池"
                  : "添加到我的抽奖池"}
              </Button>
            </div>
          )
        }
        actions={[
          {
            key: "confirm",
            text: "关闭",
            onClick: () => setShowDishDetail(null),
          },
        ]}
      />

      {/* 做法弹窗 */}
      <Modal
        visible={showRecipe}
        title={`${(activeTab === "global" ? globalFood : customFood)?.name}的做法`}
        content={(activeTab === "global" ? globalFood : customFood)?.recipe}
        closeOnMaskClick
        onClose={() => setShowRecipe(false)}
        actions={[
          {
            key: "confirm",
            text: "知道了",
            onClick: () => setShowRecipe(false),
          },
        ]}
      />
    </div>
  );
};

export default Home;
