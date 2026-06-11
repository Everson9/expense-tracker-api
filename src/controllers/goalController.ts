import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const TABLE = 'goals';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { data, error } = await supabase
    .from(TABLE).select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { title, target_amount, current_amount, target_date } = req.body;

  if (!title?.trim()) { res.status(400).json({ error: 'Título obrigatório.' }); return; }
  if (!target_amount || Number(target_amount) <= 0) { res.status(400).json({ error: 'Meta deve ser maior que zero.' }); return; }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ user_id: userId, title: title.trim(), target_amount: Number(target_amount), current_amount: Number(current_amount ?? 0), target_date: target_date ?? null })
    .select().single();

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(data);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { title, target_amount, current_amount, target_date, completed } = req.body;

  const { data, error } = await supabase
    .from(TABLE)
    .update({ title: title?.trim(), target_amount: Number(target_amount), current_amount: Number(current_amount), target_date: target_date ?? null, completed: !!completed })
    .eq('id', id).eq('user_id', userId).select().single();

  if (error) { res.status(500).json({ error: error.message }); return; }
  if (!data) { res.status(404).json({ error: 'Meta não encontrada.' }); return; }
  res.json(data);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', userId);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(204).send();
};
