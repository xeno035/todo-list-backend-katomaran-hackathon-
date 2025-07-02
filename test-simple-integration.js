// Simple integration test for create and edit task functionality
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Task from './models/Task.js';
import User from './models/user.js';

let mongoServer;

// Test data
const testUser = {
  firebaseUid: 'test_firebase_uid_123',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg'
};

const testTask = {
  title: 'Test Task',
  description: 'This is a test task description',
  dueDate: new Date('2024-12-31'),
  priority: 'high',
  status: 'pending'
};

const testUpdateData = {
  title: 'Updated Test Task',
  description: 'This is an updated test task description',
  dueDate: new Date('2024-12-30'),
  priority: 'medium',
  status: 'in-progress'
};

// Test functions
const testUserCreation = async () => {
  console.log('🧪 Testing User Creation...');
  
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: testUser.firebaseUid },
      testUser,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    console.log('✅ User created/updated successfully:', {
      id: user._id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email
    });
    
    return user;
  } catch (error) {
    console.error('❌ User creation failed:', error.message);
    throw error;
  }
};

const testTaskCreation = async (userId) => {
  console.log('\n🧪 Testing Task Creation...');
  
  try {
    const task = await Task.create({
      ...testTask,
      createdBy: userId
    });
    
    console.log('✅ Task created successfully:', {
      id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      createdBy: task.createdBy
    });
    
    return task;
  } catch (error) {
    console.error('❌ Task creation failed:', error.message);
    throw error;
  }
};

const testTaskUpdate = async (taskId) => {
  console.log('\n🧪 Testing Task Update...');
  
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      testUpdateData,
      { new: true }
    );
    
    if (!updatedTask) {
      throw new Error('Task not found');
    }
    
    console.log('✅ Task updated successfully:', {
      id: updatedTask._id,
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      status: updatedTask.status
    });
    
    return updatedTask;
  } catch (error) {
    console.error('❌ Task update failed:', error.message);
    throw error;
  }
};

const testTaskRetrieval = async (userId) => {
  console.log('\n🧪 Testing Task Retrieval...');
  
  try {
    const tasks = await Task.find({ createdBy: userId });
    
    console.log('✅ Tasks retrieved successfully:', {
      count: tasks.length,
      tasks: tasks.map(task => ({
        id: task._id,
        title: task.title,
        status: task.status,
        priority: task.priority
      }))
    });
    
    return tasks;
  } catch (error) {
    console.error('❌ Task retrieval failed:', error.message);
    throw error;
  }
};

const testTaskDeletion = async (taskId) => {
  console.log('\n🧪 Testing Task Deletion...');
  
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    
    if (!deletedTask) {
      throw new Error('Task not found for deletion');
    }
    
    console.log('✅ Task deleted successfully:', {
      id: deletedTask._id,
      title: deletedTask.title
    });
    
    // Verify deletion
    const remainingTasks = await Task.findById(taskId);
    if (remainingTasks) {
      throw new Error('Task still exists after deletion');
    }
    
    console.log('✅ Task deletion verified - task no longer exists');
    
  } catch (error) {
    console.error('❌ Task deletion failed:', error.message);
    throw error;
  }
};

const testValidation = async () => {
  console.log('\n🧪 Testing Task Validation...');
  
  try {
    // Test missing title
    const invalidTask = {
      description: 'Task without title',
      dueDate: new Date('2024-12-31'),
      priority: 'high',
      status: 'pending'
    };
    
    await Task.create(invalidTask);
    console.log('❌ Validation failed - task created without title');
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.log('✅ Validation working correctly - title required');
    } else {
      console.error('❌ Unexpected validation error:', error.message);
    }
  }
};

// Main test runner
const runIntegrationTests = async () => {
  console.log('🚀 Starting Simple Integration Tests...\n');
  
  try {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to in-memory database
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to in-memory MongoDB\n');
    
    // Run tests
    const user = await testUserCreation();
    const task = await testTaskCreation(user._id);
    const updatedTask = await testTaskUpdate(task._id);
    await testTaskRetrieval(user._id);
    await testTaskDeletion(task._id);
    await testValidation();
    
    console.log('\n🎉 All integration tests passed!');
    console.log('✅ User creation logic is working');
    console.log('✅ Task creation logic is working');
    console.log('✅ Task update logic is working');
    console.log('✅ Task retrieval logic is working');
    console.log('✅ Task deletion logic is working');
    console.log('✅ Validation is working');
    
  } catch (error) {
    console.error('\n❌ Integration test failed:', error.message);
  } finally {
    // Cleanup
    if (mongoServer) {
      await mongoose.disconnect();
      await mongoServer.stop();
      console.log('\n✅ Cleanup completed - disconnected from in-memory MongoDB');
    }
  }
};

// Run the tests
runIntegrationTests().catch(console.error); 