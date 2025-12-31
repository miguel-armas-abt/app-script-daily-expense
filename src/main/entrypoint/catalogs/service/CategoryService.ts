import { ApplicationProperties } from "../../../commons/properties/ApplicationProperties";
import { CategoryDto } from "../dto/CategoryDto";

const CategoryService = (() => {
  let cache: CategoryDto[] | null = null;

  function parseCategoriesJson(categoriesJson: string): CategoryDto[] {
    let raw = JSON.parse(categoriesJson) as any[];

    return (raw || [])
      .map(
        (category) =>
          new CategoryDto(
            String(category.id || ""),
            category.description,
            Number(category.limit)
          )
      )
      .filter((c) => !!c.description);
  }

  function getCategories(): CategoryDto[] {
    if (cache) return cache;
    cache = parseCategoriesJson(ApplicationProperties.getCategoriesJson());
    return cache;
  }

  function normalizeForSave(list: CategoryDto[]): CategoryDto[] {
    const out: CategoryDto[] = [];
    for (let i = 0; i < (list || []).length; i++) {
      const c = list[i];
      const description = c.description;
      if (!description) continue;

      const id = c.id || Utilities.getUuid();
      const limit = Number(c.limit);

      out.push(new CategoryDto(String(id), description, limit));
    }
    return out;
  }

  function replaceCategories(categories: CategoryDto[]): void {
    const normalized = normalizeForSave(categories || []);

    const serialized = JSON.stringify(
      normalized.map((category) => ({
        id: category.id,
        description: category.description,
        limit: category.limit,
      }))
    );

    ApplicationProperties.setCategoriesJson(serialized);
    cache = normalized;
  }

  return {
    getCategories,
    replaceCategories,
  };
})();

export default CategoryService;
