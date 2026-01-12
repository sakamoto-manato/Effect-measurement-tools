import { supabase } from '../lib/supabase';
import { Organization } from '../types';

/**
 * Supabaseから全法人を取得
 */
export async function getOrganizations(): Promise<Organization[]> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('法人一覧の取得エラー:', error);
      throw error;
    }

    // SupabaseのデータをOrganization型に変換
    return (data || []).map((org) => ({
      id: org.id,
      slug: org.slug,
      name: org.name,
      createdAt: org.created_at.split('T')[0], // YYYY-MM-DD形式に変換
      memberCount: 0, // TODO: profilesテーブルから集計
      avgScore: 0, // TODO: survey_responsesテーブルから集計
      // その他のフィールドは現在のスキーマにないため、デフォルト値を使用
      accountId: org.slug, // 暫定的にslugを使用
    }));
  } catch (error) {
    console.error('法人一覧の取得に失敗しました:', error);
    return [];
  }
}

/**
 * IDで法人を取得
 */
export async function getOrganizationById(id: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('法人の取得エラー:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      createdAt: data.created_at.split('T')[0],
      memberCount: 0,
      avgScore: 0,
      accountId: data.slug,
    };
  } catch (error) {
    console.error('法人の取得に失敗しました:', error);
    return null;
  }
}

/**
 * Slugで法人を取得
 */
export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('法人の取得エラー:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      createdAt: data.created_at.split('T')[0],
      memberCount: 0,
      avgScore: 0,
      accountId: data.slug,
    };
  } catch (error) {
    console.error('法人の取得に失敗しました:', error);
    return null;
  }
}

/**
 * 新規法人を作成
 */
export async function createOrganization(
  orgData: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'avgScore'>
): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        slug: orgData.slug,
        name: orgData.name,
      })
      .select()
      .single();

    if (error) {
      console.error('法人の作成エラー:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      createdAt: data.created_at.split('T')[0],
      memberCount: 0,
      avgScore: 0,
      accountId: data.slug,
      // その他のフィールドは現在のスキーマにないため、デフォルト値を使用
      logo: orgData.logo,
      description: orgData.description,
      website: orgData.website,
      address: orgData.address,
      phone: orgData.phone,
      email: orgData.email,
      password: orgData.password,
    };
  } catch (error) {
    console.error('法人の作成に失敗しました:', error);
    throw error;
  }
}

/**
 * 法人を更新
 */
export async function updateOrganization(
  id: string,
  orgData: Partial<Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'avgScore'>>
): Promise<Organization | null> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (orgData.name) updateData.name = orgData.name;
    if (orgData.slug) updateData.slug = orgData.slug;

    const { data, error } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('法人の更新エラー:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      createdAt: data.created_at.split('T')[0],
      memberCount: 0,
      avgScore: 0,
      accountId: data.slug,
    };
  } catch (error) {
    console.error('法人の更新に失敗しました:', error);
    throw error;
  }
}

/**
 * 法人を削除
 */
export async function deleteOrganization(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('法人の削除エラー:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('法人の削除に失敗しました:', error);
    throw error;
  }
}

/**
 * Slugの重複チェック
 */
export async function checkSlugAvailability(slug: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Slugの重複チェックエラー:', error);
      return false;
    }

    // データが存在しない場合、利用可能
    return (data || []).length === 0;
  } catch (error) {
    console.error('Slugの重複チェックに失敗しました:', error);
    return false;
  }
}
