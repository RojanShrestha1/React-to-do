import { useState, useEffect, useRef } from 'react';
import {
  MantineProvider, ColorSchemeProvider, Container, Text, Title, Modal, 
  TextInput, Group, Card, ActionIcon, Button, Badge, Stack, 
  Divider, Paper, SimpleGrid
} from '@mantine/core';
import { useLocalStorage, useHotkeys } from '@mantine/hooks';
import { MoonStars, Sun, Trash, Plus, Terminal, Check } from 'tabler-icons-react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  
  // Theme logic
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const taskTitle = useRef('');
  const taskSummary = useRef('');

  // CRUD Logic
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const handleCreate = () => {
    if (!taskTitle.current.value) return;
    const newTasks = [...tasks, { 
      id: Date.now(), 
      title: taskTitle.current.value, 
      summary: taskSummary.current.value 
    }];
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    setOpened(false);
  };

  const handleDelete = (id) => {
    const filtered = tasks.filter(t => t.id !== id);
    setTasks(filtered);
    localStorage.setItem('tasks', JSON.stringify(filtered));
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, primaryColor: 'cyan' }} withGlobalStyles withNormalizeCSS>
        <Paper radius={0} style={{ minHeight: '100vh', paddingBottom: '40px' }}>
          
          <Container size="sm" pt={40}>
            {/* Header Section */}
            <Group position="apart" mb={30}>
              <Stack spacing={0}>
                <Group spacing="xs">
                  <Terminal size={28} color="cyan" />
                  <Title order={1} sx={{ letterSpacing: -1 }}>TaskOps <Text span color="cyan" inherit>v1.0</Text></Title>
                </Group>
                <Text color="dimmed" size="sm">Local Environment Runner</Text>
              </Stack>
              
              <ActionIcon variant="outline" color={colorScheme === 'dark' ? 'yellow' : 'blue'} onClick={() => toggleColorScheme()} size="lg">
                {colorScheme === 'dark' ? <Sun size={18} /> : <MoonStars size={18} />}
              </ActionIcon>
            </Group>

            {/* Stats / Status Row */}
            <SimpleGrid cols={2} mb="xl">
              <Paper withBorder p="md" radius="md">
                <Text size="xs" color="dimmed" weight={700} transform="uppercase">Active Containers</Text>
                <Text size="xl" weight={700}>{tasks.length}</Text>
              </Paper>
              <Paper withBorder p="md" radius="md">
                <Text size="xs" color="dimmed" weight={700} transform="uppercase">System Status</Text>
                <Badge color="green" variant="dot" size="lg">Healthy</Badge>
              </Paper>
            </SimpleGrid>

            <Divider mb="xl" label="Current Task Queue" labelPosition="center" />

            {/* Tasks List */}
            <Stack spacing="md">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <Card key={task.id} withBorder shadow="sm" p="lg" radius="md">
                    <Group position="apart">
                      <Group>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22b8cf' }} />
                        <Text weight={600} size="lg">{task.title}</Text>
                      </Group>
                      <ActionIcon color="red" variant="light" onClick={() => handleDelete(task.id)}>
                        <Trash size={16} />
                      </ActionIcon>
                    </Group>
                    <Text color="dimmed" size="sm" mt="sm" pl={22}>
                      {task.summary || "No deployment notes provided."}
                    </Text>
                  </Card>
                ))
              ) : (
                <Paper withBorder p={40} radius="md" style={{ textAlign: 'center', borderStyle: 'dashed' }}>
                  <Text color="dimmed">No tasks in pipeline. Click 'Deploy New Task' to begin.</Text>
                </Paper>
              )}
            </Stack>

            <Button 
              fullWidth 
              size="md" 
              mt={30} 
              leftIcon={<Plus size={18} />} 
              variant="gradient" 
              gradient={{ from: 'cyan', to: 'blue' }}
              onClick={() => setOpened(true)}
            >
              Deploy New Task
            </Button>
          </Container>

          {/* New Task Modal */}
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={<Text weight={700}>Initialize New Instance</Text>}
            centered
            radius="md"
          >
            <Stack>
              <TextInput label="Service Name" placeholder="e.g. Database Migration" ref={taskTitle} required />
              <TextInput label="Description" placeholder="Deployment details..." ref={taskSummary} />
              <Group position="right" mt="md">
                <Button variant="subtle" onClick={() => setOpened(false)}>Abort</Button>
                <Button leftIcon={<Check size={16} />} onClick={handleCreate}>Commit & Run</Button>
              </Group>
            </Stack>
          </Modal>
        </Paper>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}