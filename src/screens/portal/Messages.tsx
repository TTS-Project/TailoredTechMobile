import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  sender_role: 'client' | 'admin';
  body: string;
  created_at: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_role, body, created_at')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Failed to load messages:', error.message);
    } else {
      setMessages(data as Message[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();

    // Live updates so a client sees admin replies without refreshing
    const channel = supabase
      .channel('messages-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => loadMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    const { data: clientRow } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', userData.user?.id)
      .single();

    if (!clientRow) {
      console.error('No client record found for this user.');
      return;
    }

    const { error } = await supabase.from('messages').insert({
      client_id: clientRow.id,
      sender_role: 'client',
      body: draft.trim(),
    });

    if (error) {
      console.error('Failed to send message:', error.message);
      return;
    }
    setDraft('');
  }

  if (loading) return <p>Loading messages…</p>;

  return (
    <div>
      <h1>Messages</h1>
      <div>
        {messages.map((m) => (
          <div key={m.id} style={{ textAlign: m.sender_role === 'admin' ? 'left' : 'right' }}>
            <p>
              <strong>{m.sender_role === 'admin' ? 'Tailored Tech Solutions' : 'You'}:</strong>{' '}
              {m.body}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message the TTS team…"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
