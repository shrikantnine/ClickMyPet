// Example test script for AI generation
// Run with: node --experimental-modules test-generation.mjs

const BASE_URL = 'http://localhost:3000'

// Test data
const testSelections = {
  petType: 'dog',
  petBreed: 'golden-retriever',
  petName: 'Max',
  style: 'professional-portrait',
  background: 'studio-white',
  accessories: ['bow-tie'],
}

// Test 1: Generate images
async function testGenerateImages(authToken) {
  console.log('🎨 Testing image generation...')
  
  const response = await fetch(`${BASE_URL}/api/generate-images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      selections: testSelections,
      numImages: 2,
    }),
  })
  
  const data = await response.json()
  
  if (response.ok) {
    console.log('✅ Generation started:', data)
    return data.generationId
  } else {
    console.error('❌ Generation failed:', data)
    return null
  }
}

// Test 2: Check status
async function testCheckStatus(generationId, authToken) {
  console.log('🔍 Checking generation status...')
  
  const response = await fetch(
    `${BASE_URL}/api/generate-images?id=${generationId}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    }
  )
  
  const data = await response.json()
  
  if (response.ok) {
    console.log('✅ Status:', data.status)
    console.log('   Progress:', data.progress + '%')
    if (data.images?.length > 0) {
      console.log('   Images:', data.images.length)
    }
    return data
  } else {
    console.error('❌ Status check failed:', data)
    return null
  }
}

// Test 3: Admin analytics
async function testAdminAnalytics(adminKey) {
  console.log('📊 Testing admin analytics...')
  
  const response = await fetch(
    `${BASE_URL}/api/admin/analytics?days=30`,
    {
      headers: {
        'Authorization': `Bearer ${adminKey}`,
      },
    }
  )
  
  const data = await response.json()
  
  if (response.ok) {
    console.log('✅ Analytics retrieved:')
    console.log('   Total Users:', data.platformStats?.totalUsers)
    console.log('   Active Subscriptions:', data.platformStats?.activeSubscriptions)
    console.log('   Total Generations:', data.platformStats?.totalGenerations)
    console.log('   Total Revenue: $' + data.platformStats?.totalRevenue)
    console.log('   Popular Styles:', data.popularStyles?.slice(0, 3).map(s => s.style))
    return data
  } else {
    console.error('❌ Analytics failed:', data)
    return null
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting AI Generation Tests\n')
  
  // Get from command line args or use defaults
  const USER_TOKEN = process.env.USER_TOKEN || 'your_user_auth_token'
  const ADMIN_KEY = process.env.ADMIN_API_KEY || 'your_admin_api_key'
  
  console.log('Configuration:')
  console.log('  Base URL:', BASE_URL)
  console.log('  User Token:', USER_TOKEN.substring(0, 10) + '...')
  console.log('  Admin Key:', ADMIN_KEY.substring(0, 10) + '...\n')
  
  // Test 1: Generate Images
  const generationId = await testGenerateImages(USER_TOKEN)
  
  if (generationId) {
    console.log('\n⏳ Waiting 5 seconds before checking status...\n')
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Test 2: Check Status
    const status = await testCheckStatus(generationId, USER_TOKEN)
    
    if (status?.status === 'processing') {
      console.log('\n💡 Images still processing. Check again later with:')
      console.log(`   curl ${BASE_URL}/api/generate-images?id=${generationId}`)
    }
  }
  
  console.log('\n')
  
  // Test 3: Admin Analytics
  await testAdminAnalytics(ADMIN_KEY)
  
  console.log('\n✅ Tests completed!')
  console.log('\n📝 Next steps:')
  console.log('   1. Check generation status with GET /api/generate-images?id=' + generationId)
  console.log('   2. View admin dashboard at http://localhost:3000/admin/dashboard')
  console.log('   3. Monitor analytics in real-time')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error)
}

export { testGenerateImages, testCheckStatus, testAdminAnalytics }
