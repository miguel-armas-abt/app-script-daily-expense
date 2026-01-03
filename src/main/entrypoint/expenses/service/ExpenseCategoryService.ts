import { ApplicationProperties } from "../../../commons/properties/ApplicationProperties";
import { ExpenseCategoryDto } from "../dto/response/ExpenseCategoryDto";

const ExpenseCategoryService = (() => {
  let cache: ExpenseCategoryDto[] | null = null;

  function fromJsonToDto(categoriesJson: string): ExpenseCategoryDto[] {
    const raw = JSON.parse(categoriesJson || "[]") as any[];
    const categories: ExpenseCategoryDto[] = [];

    for (let i = 0; i < (raw || []).length; i++) {
      const category = raw[i] || {};
      categories.push(new ExpenseCategoryDto(category.description.trim(), Number(category.limit)));
    }

    return categories;
  }

  function getCategories(): ExpenseCategoryDto[] {
    if (cache) return cache;
    cache = fromJsonToDto(ApplicationProperties.getCategoriesJson());
    return cache;
  }

  function findCategory(description: string): ExpenseCategoryDto {
    const categories = getCategories();
    const category = categories.find(c => String(c.description).trim() === description);
    if(!category) {
      throw new Error('[ExpenseCategoryService] No such category');
    }
    return category;
  }

  function replaceCategories(categories: ExpenseCategoryDto[]): void {
    const jsonCategories = JSON.stringify(
      categories.map((category) => ({
        description: category.description,
        limit: category.limit,
      }))
    );

    ApplicationProperties.setCategoriesJson(jsonCategories);
    cache = categories;
  }

  return {
    getCategories,
    replaceCategories,
    findCategory
  };
})();

export default ExpenseCategoryService;
