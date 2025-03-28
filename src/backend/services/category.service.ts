import { supabase } from '../db/supabase';
import { Category } from '../types';

export const categoryService = {
  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get categories by type
  async getCategoriesByType(type: 'income' | 'expense') {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', type)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Add a new category
  async addCategory(category: Omit<Category, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update a category
  async updateCategory(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a category
  async deleteCategory(id: string) {
    // Check if any transactions use this category
    const { data: transactions, error: checkError } = await supabase
      .from('transactions')
      .select('id')
      .eq('category_id', id)
      .limit(1);
    
    if (checkError) throw checkError;
    
    if (transactions.length > 0) {
      throw new Error('Cannot delete category that has transactions');
    }
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};