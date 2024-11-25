import { defineStore } from 'pinia';


export const useItemStore = defineStore('itemStore', () => {
    const items = ref([]);
    const filterType = ref('all'); // フィルター初期値: 'all'
    const searchQuery = ref(''); // 検索クエリ

    // アイテムを取得
    const fetchItems = async () => {
        try {
            const client = useSanctumClient();
            const response = await client('http://localhost:8080/api/items');
            items.value = response.items;
        } catch (error) {
            console.error('全アイテム取得エラー:', error);
        }
    };

    // フィルター済みのアイテムを計算
    const filteredItems = computed(() => {
        let result = [...items.value];

        if (filterType.value === 'favorites') {
            result = result.filter((item) => item.isLiked);
        }

        if (searchQuery.value) {
            result = result.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        }

        return result;
    });

    // フィルタータイプを設定
    const setFilterType = (type) => {
        filterType.value = type;
        console.log('フィルター変更', filterType.value)
    };

    // 検索クエリを設定
    const setSearchQuery = (query) => {
        searchQuery.value = query;
    };

    return {
        items,
        filteredItems,
        filterType,
        searchQuery,
        fetchItems,
        setFilterType,
        setSearchQuery,
    };
});