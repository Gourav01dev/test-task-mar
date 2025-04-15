import { supabase } from '../db/supabase';
import { Category } from '../types';

export const categoryService = {
  // Get all categories for the current user
  async getCategories() {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)  // Filter by the current user's ID
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get categories by type for the current user
  async getCategoriesByType(type: 'income' | 'expense') {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)  // Filter by the current user's ID
      .eq('type', type)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Add a new category for the current user
  async addCategory(category: Omit<Category, 'id' | 'created_at' | 'user_id'>) {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const categoryWithUserId = {
      ...category,
      user_id: user.id  // Set the user_id field
    };
    
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryWithUserId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update a category (with user verification)
  async updateCategory(id: string, category: Partial<Category>) {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Verify ownership before updating
    const { data: existing, error: fetchError } = await supabase
      .from('categories')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    if (existing.user_id !== user.id) {
      throw new Error('You do not have permission to update this category');
    }
    
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a category (with user verification)
  async deleteCategory(id: string) {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Verify ownership before deleting
    const { data: existing, error: fetchError } = await supabase
      .from('categories')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    if (existing.user_id !== user.id) {
      throw new Error('You do not have permission to delete this category');
    }
    
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