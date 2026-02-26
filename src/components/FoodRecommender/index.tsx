import React, { useState, useEffect } from "react";
import { Card, Tag, Space, Button, Input, Grid, Badge } from "antd-mobile";
import { CloseCircleOutline, CheckCircleOutline } from "antd-mobile-icons";
import { foods, FoodItem, allIngredients } from "../../data/food";
import "./index.css";

interface FoodRecommenderProps {
  onSelectDish: (dish: FoodItem) => void;
  onAddToLottery: (dish: FoodItem) => void;
  selectedDishes?: FoodItem[];
}

const FoodRecommender: React.FC<FoodRecommenderProps> = ({
  onSelectDish,
  onAddToLottery,
  selectedDishes = [],
}) => {
  const [searchMode, setSearchMode] = useState<"ingredient" | "dish">(
    "ingredient",
  );
  const [searchText, setSearchText] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recommendedFoods, setRecommendedFoods] = useState<FoodItem[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // 根据食材推荐菜品
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      const recommended = foods.filter((food: { ingredients: string[] }) =>
        food.ingredients.some((ing: string) =>
          selectedIngredients.includes(ing),
        ),
      );
      setRecommendedFoods(recommended);
      setShowRecommendations(true);
    } else {
      setShowRecommendations(false);
    }
  }, [selectedIngredients]);

  // 搜索菜品
  const searchDishes = () => {
    if (!searchText.trim()) return;

    const searchLower = searchText.toLowerCase();
    const matched = foods.filter(
      (food: { name: string; tags: any[] }) =>
        food.name.toLowerCase().includes(searchLower) ||
        food.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    );
    setRecommendedFoods(matched);
    setShowRecommendations(true);
  };

  // 添加食材
  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setSearchText("");
  };

  // 移除食材
  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient));
  };

  // 清除所有食材
  const clearIngredients = () => {
    setSelectedIngredients([]);
    setShowRecommendations(false);
  };

  // 检查菜品是否已被选中
  const isDishSelected = (dishId: string) => {
    return selectedDishes.some((d) => d.id === dishId);
  };

  return (
    <div className="food-recommender">
      {/* 模式切换 */}
      <Card className="mode-selector">
        <Space justify="center" block>
          <Button
            color={searchMode === "ingredient" ? "primary" : "default"}
            onClick={() => setSearchMode("ingredient")}
            size="small"
          >
            🥬 按食材推荐
          </Button>
          <Button
            color={searchMode === "dish" ? "primary" : "default"}
            onClick={() => setSearchMode("dish")}
            size="small"
          >
            🍳 按菜品搜索
          </Button>
        </Space>
      </Card>

      {/* 搜索/输入区域 */}
      <Card className="search-section">
        {searchMode === "ingredient" ? (
          <>
            <div className="ingredient-input">
              <Input
                placeholder="输入食材名称（如：鸡蛋、番茄）"
                value={searchText}
                onChange={setSearchText}
                onEnterPress={() => {
                  if (searchText && allIngredients.includes(searchText)) {
                    addIngredient(searchText);
                  }
                }}
                style={
                  {
                    "--color": "#333333", // 覆盖颜色变量
                    "--adm-color-text": "#333333",
                    "--adm-color-background": "#f8f9fc",
                    color: "#333333",
                  } as React.CSSProperties
                }
                className="force-dark-text-input"
              />
              <Button
                color="primary"
                size="small"
                onClick={() => {
                  if (searchText && allIngredients.includes(searchText)) {
                    addIngredient(searchText);
                  }
                }}
              >
                添加
              </Button>
            </div>

            {/* 已选食材 */}
            {selectedIngredients.length > 0 && (
              <div className="selected-ingredients">
                <div className="section-title">已选食材：</div>
                <Space wrap>
                  {selectedIngredients.map((ing) => (
                    <Badge
                      key={ing}
                      content={
                        <CloseCircleOutline
                          className="remove-icon"
                          onClick={() => removeIngredient(ing)}
                        />
                      }
                    >
                      <Tag color="primary">{ing}</Tag>
                    </Badge>
                  ))}
                  <Button
                    size="mini"
                    color="danger"
                    fill="none"
                    onClick={clearIngredients}
                  >
                    清除全部
                  </Button>
                </Space>
              </div>
            )}

            {/* 常见食材快捷选择 */}
            <div className="common-ingredients">
              <div className="section-title">常见食材：</div>
              <Space wrap>
                {["鸡蛋", "番茄", "猪肉", "土豆", "鸡翅", "豆腐"].map((ing) => (
                  <Tag
                    key={ing}
                    color={
                      selectedIngredients.includes(ing) ? "primary" : "default"
                    }
                    onClick={() => {
                      if (selectedIngredients.includes(ing)) {
                        removeIngredient(ing);
                      } else {
                        addIngredient(ing);
                      }
                    }}
                  >
                    {ing}
                  </Tag>
                ))}
              </Space>
            </div>
          </>
        ) : (
          <div className="ingredient-input">
            <Input
              placeholder="输入食材名称（如：鸡蛋、番茄）"
              value={searchText}
              onChange={setSearchText}
              onEnterPress={() => {
                if (searchText && allIngredients.includes(searchText)) {
                  addIngredient(searchText);
                }
              }}
              style={
                {
                  "--color": "#333333", // 覆盖颜色变量
                  "--adm-color-text": "#333333",
                  "--adm-color-background": "#f8f9fc",
                  color: "#333333",
                } as React.CSSProperties
              }
              className="force-dark-text-input"
            />
            <Button
              color="primary"
              size="small"
              onClick={() => {
                if (searchText && allIngredients.includes(searchText)) {
                  addIngredient(searchText);
                }
              }}
            >
              添加
            </Button>
          </div>
        )}
      </Card>

      {/* 推荐结果 */}
      {/* 推荐结果 */}
      {showRecommendations && (
        <Card className="recommendations">
          <div className="section-title">
            推荐菜品 ({recommendedFoods.length})
          </div>
          <div className="recommendations-scroll">
            <Grid columns={1} gap={8}>
              {recommendedFoods.map((food) => (
                <Card key={food.id} className="recommendation-item">
                  <Grid columns={12} gap={8}>
                    <Grid.Item span={10}>
                      <div className="dish-name">{food.name}</div>
                      <Space wrap className="dish-tags">
                        <Tag color="success" className="dish-tag">
                          {food.cookingTime === "fast"
                            ? "⚡快速"
                            : food.cookingTime === "medium"
                              ? "⏱️适中"
                              : "🐢慢工"}
                        </Tag>
                        <Tag color="warning" className="dish-tag">
                          {food.difficulty === "easy"
                            ? "🌟简单"
                            : food.difficulty === "medium"
                              ? "📚中等"
                              : "🔥复杂"}
                        </Tag>
                        <Tag color="primary" className="dish-tag">
                          {food.cuisine}
                        </Tag>
                        {food.calories && (
                          <Tag color="danger" className="dish-tag calorie-tag">
                            🔥 {food.calories}
                          </Tag>
                        )}
                      </Space>

                      {/* 食材列表 */}
                      <div className="ingredients">
                        <span className="ingredients-label">🥗 食材：</span>
                        {food.ingredients.join(" · ")}
                      </div>

                      {/* 简短描述 */}
                      {food.description && (
                        <div className="dish-description">
                          <span className="description-label">📝 描述：</span>
                          {food.description}
                        </div>
                      )}

                      {/* 标签列表 */}
                      <div className="dish-tag-list">
                        {food.tags.map((tag) => (
                          <span key={tag} className="dish-tag-item">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </Grid.Item>

                    {/* 操作按钮 - 已修复 aria-label 替代 title */}
                    <Grid.Item span={2} className="action-buttons">
                      <Button
                        size="small"
                        color="primary"
                        fill={isDishSelected(food.id) ? "solid" : "outline"}
                        onClick={() => onAddToLottery(food)}
                        className="select-btn"
                        aria-label={
                          isDishSelected(food.id)
                            ? "从抽奖池移除"
                            : "添加到抽奖池"
                        }
                      >
                        {isDishSelected(food.id) ? "✓" : "+"}
                      </Button>
                      <Button
                        size="small"
                        color="default"
                        fill="outline"
                        onClick={() => onSelectDish(food)}
                        className="detail-btn"
                        aria-label="查看详情"
                      >
                        📋
                      </Button>
                    </Grid.Item>
                  </Grid>
                </Card>
              ))}
            </Grid>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FoodRecommender;
