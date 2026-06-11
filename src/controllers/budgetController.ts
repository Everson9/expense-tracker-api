import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const TABLE = 'budgets';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId);

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
};

export const upsert = async (req: Request, res: Response): Promise<void> => {
  const userId   = req.user!.id;
  const { category } = req.params;
  const { amount }   = req.body;

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    res.status(400).json({ error: 'amount deve ser maior que zero.' });
    return;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, category, amount: Number(amount) }, { onConflict: 'user_id,category' })
    .select()
    .single();

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const userId       = req.user!.id;
  const { category } = req.params;

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('category', category);

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(204).send();
};
