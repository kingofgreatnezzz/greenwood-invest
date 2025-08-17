#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up investlp Investment Platform...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/investlp

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here-change-in-production
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('⚠️  Please update the secret keys in .env.local before production use!\n');
} else {
  console.log('✅ .env.local file already exists!\n');
}

// Check package.json for required dependencies
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = ['next-auth', 'bcryptjs', 'mongoose'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

  if (missingDeps.length > 0) {
    console.log('📦 Installing missing dependencies...');
    console.log(`Missing: ${missingDeps.join(', ')}`);
    console.log('Run: npm install ' + missingDeps.join(' '));
    console.log('');
  } else {
    console.log('✅ All required dependencies are installed!\n');
  }
}

console.log('🎯 Next steps:');
console.log('1. Install dependencies: npm install next-auth bcryptjs mongoose');
console.log('2. Set up MongoDB (local or Atlas)');
console.log('3. Update .env.local with your configuration');
console.log('4. Run the development server: npm run dev');
console.log('5. Visit http://localhost:3000 to see your application!\n');

console.log('📚 For detailed setup instructions, see README.md');
console.log('🔗 For MongoDB setup: https://docs.mongodb.com/manual/installation/');
console.log('🔗 For NextAuth setup: https://next-auth.js.org/getting-started/introduction\n');

console.log('✨ Setup complete! Happy coding! 🎉');

