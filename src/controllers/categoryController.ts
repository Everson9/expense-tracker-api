import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const TABLE = 'categories';

const DEFAULT_CATEGORIES = [
  { name: 'alimentação', icon: '🍔' },
  { name: 'transporte',  icon: '🚗' },
  { name: 'lazer',       icon: '🎮' },
  { name: 'saúde',       icon: '💊' },
  { name: 'moradia',     icon: '🏠' },
  { name: 'outros',      icon: '📦' },
];

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) { res.status(500).json({ error: error.message }); return; }

  if (data.length === 0) {
    const seeds = DEFAULT_CATEGORIES.map(c => ({ ...c, user_id: userId }));
    const { data: seeded, error: seedError } = await supabase
      .from(TABLE)
      .insert(seeds)
      .select();

    if (seedError) { res.status(500).json({ error: seedError.message }); return; }
    res.json(seeded);
    return;
  }

  res.json(data);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { name, icon } = req.body;

  if (!name || name.trim().length < 2) {
    res.status(400).json({ error: 'Nome deve ter pelo menos 2 caracteres.' });
    return;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ user_id: userId, name: name.trim(), icon: icon ?? '📦' })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Você já tem uma categoria com esse nome.' });
    } else {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  res.status(201).json(data);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { name, icon } = req.body;

  if (!name || name.trim().length < 2) {
    res.status(400).json({ error: 'Nome deve ter pelo menos 2 caracteres.' });
    return;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update({ name: name.trim(), icon: icon ?? '📦' })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) { res.status(500).json({ error: error.message }); return; }
  if (!data) { res.status(404).json({ error: 'Categoria não encontrada.' }); return; }

  res.json(data);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(204).send();
};
