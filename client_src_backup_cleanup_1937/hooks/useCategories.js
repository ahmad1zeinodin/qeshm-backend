import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://app-nodejs-8v5ir.apps.teh11.abrhapaas.com:31272';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        if (res.data.success) {
          // فلت کردن برای استفاده در جاهای دیگر (مثل نوار متحرک)
          const flatten = (tree) => tree.flatMap(item => [item, ...(item.children || [])]);
          setCategories(flatten(res.data.data));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, isLoading };
}
