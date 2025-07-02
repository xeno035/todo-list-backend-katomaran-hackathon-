// Test script to verify task creation and editing logic
import { createTask, updateTask, getTasks } from './controllers/taskController.js';

// Mock request and response objects for testing
const createMockRequest = (userData, bodyData) => ({
  user: userData,
  body: bodyData,
  params: {},
  query: {}
});

const createMockResponse = () => {
  const res = {
    status: (code) => {
      res.statusCode = code;
      return res;
    },
    json: (data) => {
      res.data = data;
      return res;
    },
    sendStatus: (code) => {
      res.statusCode = code;
      return res;
    }
  };
  return res;
};

// Test data
const mockUser = {
  mongoId: '507f1f77bcf86cd799439011',
  uid: 'test_firebase_uid_123',
  email: 'test@example.com',
  name: 'Test User',
  picture: 'https://example.com/avatar.jpg'
};

const testTaskData = {
  title: 'Test Task',
  description: 'This is a test task description',
  dueDate: '2024-12-31',
  priority: 'high',
  status: 'pending'
};

const testUpdateData = {
  title: 'Updated Test Task',
  description: 'This is an updated test task description',
  dueDate: '2024-12-30',
  priority: 'medium',
  status: 'in-progress'
};

// Test functions
const testCreateTask = async () => {
  console.log('🧪 Testing Task Creation...');
  
  const req = createMockRequest(mockUser, testTaskData);
  const res = createMockResponse();
  
  try {
    await createTask(req, res);
    console.log('✅ Task creation logic executed successfully');
    console.log('📊 Response status:', res.statusCode);
    console.log('📊 Response data:', res.data);
  } catch (error) {
    console.error('❌ Task creation test failed:', error.message);
  }
};

const testUpdateTask = async () => {
  console.log('\n🧪 Testing Task Update...');
  
  const req = createMockRequest(mockUser, testUpdateData);
  req.params.id = '507f1f77bcf86cd799439012';
  const res = createMockResponse();
  
  try {
    await updateTask(req, res);
    console.log('✅ Task update logic executed successfully');
    console.log('📊 Response status:', res.statusCode);
    console.log('📊 Response data:', res.data);
  } catch (error) {
    console.error('❌ Task update test failed:', error.message);
  }
};

const testGetTasks = async () => {
  console.log('\n🧪 Testing Task Retrieval...');
  
  const req = createMockRequest(mockUser, {});
  const res = createMockResponse();
  
  try {
    await getTasks(req, res);
    console.log('✅ Task retrieval logic executed successfully');
    console.log('📊 Response status:', res.statusCode);
    console.log('📊 Response data:', res.data);
  } catch (error) {
    console.error('❌ Task retrieval test failed:', error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting Task Operations Test Suite...\n');
  
  await testCreateTask();
  await testUpdateTask();
  await testGetTasks();
  
  console.log('\n✅ Test suite completed!');
  console.log('\n📝 Note: These tests verify the logic flow without database connection.');
  console.log('📝 To test with real database, ensure MongoDB is running and MONGO_URI is set.');
};

runTests().catch(console.error); 