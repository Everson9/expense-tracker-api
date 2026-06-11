import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreateExpenseDTO, UpdateExpenseDTO } from '../models/expense';

const TABLE = 'expenses';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    res.status(404).json({ error: 'Gasto não encontrado.' });
    return;
  }

  res.json(data);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateExpenseDTO;

  if (!body.title || body.amount === undefined || !body.category || !body.date) {
    res.status(400).json({ error: 'Campos title, amount, category e date são obrigatórios.' });
    return;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert([body])
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const body = req.body as UpdateExpenseDTO;

  const { data, error } = await supabase
    .from(TABLE)
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  if (!data) {
    res.status(404).json({ error: 'Gasto não encontrado.' });
    return;
  }

  res.json(data);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).send();
};
