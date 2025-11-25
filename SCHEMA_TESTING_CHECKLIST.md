# 🧪 Schema Testing Checklist

## Quick Verification Steps

### ✅ Step 1: View Source
```bash
# Visit your site and view source
# Press: Cmd+Option+U (Mac) or Ctrl+U (Windows)
# Search for: "application/ld+json"
# Expected: 11 script tags with JSON-LD data
```

### ✅ Step 2: Google Rich Results Test
1. Go to: https://search.google.com/test/rich-results
2. Enter: `https://petpx.com`
3. Click: "Test URL"
4. Wait: 30-60 seconds
5. Verify: All schemas detected

**Expected Results:**
```
✓ Organization - VALID
✓ WebSite - VALID  
✓ Service - VALID
✓ Product (Starter) - VALID
✓ Product (Pro) - VALID
✓ Product (Max) - VALID
✓ ItemList (Species) - VALID
✓ ItemList (Styles) - VALID
✓ ItemList (Backgrounds) - VALID
✓ FAQPage - VALID
✓ BreadcrumbList - VALID
```

### ✅ Step 3: Schema Validator
1. Go to: https://validator.schema.org
2. Paste: Your page HTML source
3. Click: "Run Test"
4. Check: No errors or warnings

### ✅ Step 4: Browser DevTools
```javascript
// Open Console (F12)
// Run this command:
JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].textContent)

// Should return your Organization schema
```

### ✅ Step 5: Google Search Console
1. Submit sitemap with structured data pages
2. Wait 3-7 days for indexing
3. Check "Enhancements" → "Products"
4. Check "Enhancements" → "FAQ"
5. Monitor impressions and clicks

---

## 🎯 Expected Rich Snippets Preview

### Product Card Example:
```
┌─────────────────────────────────────┐
│ PetPX Pro Plan - AI Pet Portraits  │
│ ★★★★★ 4.9 (284 reviews)            │
│ $29.00 - In Stock                  │
│ 40 images • 8 styles • 2K quality  │
└─────────────────────────────────────┘
```

### FAQ Example:
```
How much does PetPX cost?
▼ PetPX offers three plans: Starter ($15 for 20 images), 
  Pro ($29 for 40 images - most popular), and Max...
```

### Breadcrumb Example:
```
petpx.com › gallery › pricing
```

---

## 🐛 Troubleshooting

### Issue: "No structured data found"
**Solution**: 
- Check if scripts are in `<head>` section
- Verify JSON is valid (use JSONLint.com)
- Clear cache and retest

### Issue: "Missing required field"
**Solution**:
- Check schema documentation
- Ensure all required properties exist
- Validate against schema.org specs

### Issue: "Invalid price format"
**Solution**:
- Use format: "15.00" (string with 2 decimals)
- Include currency: "USD"
- Check priceValidUntil date is future

---

## 📊 Success Metrics

### Week 1-2:
- [ ] All schemas validated
- [ ] No errors in Search Console
- [ ] Rich results appearing in test tool

### Month 1:
- [ ] Product cards showing in search
- [ ] FAQ snippets appearing
- [ ] CTR increased 20-50%

### Month 3:
- [ ] Star ratings visible in SERPs
- [ ] Knowledge panel created
- [ ] CTR increased 100-150%

---

**Status**: Ready to test! 🚀
**Next**: Run Google Rich Results Test
