# Expense Tracker Mobile App - Design Guidelines

## Architecture Decisions

### Authentication
**Auth Required**: YES
- Users need accounts to store expense data securely
- Multiple financial accounts per user
- SSO Implementation:
  - Apple Sign-In (required for iOS)
  - Google Sign-In for cross-platform support
- Auth screens required:
  - Welcome/onboarding screen
  - Sign-in screen with SSO buttons
  - Account screen with logout and delete account options
  - Privacy policy & terms of service links

### Navigation Architecture
**Root Navigation**: Tab Navigation (4 tabs)
- **Home Tab**: Dashboard with expense summary and recent transactions
- **Receipts Tab**: Receipt capture and gallery
- **Accounts Tab**: Linked financial accounts and transaction sync
- **Profile Tab**: User settings, categories, and account management

**Floating Action Button**: Center-bottom FAB for primary action (Scan Receipt)
- Position: Above tab bar, centered
- Action: Opens camera for receipt capture

### Screen Specifications

#### 1. Home/Dashboard Screen
- **Purpose**: Overview of spending with summary cards and recent activity
- **Layout**:
  - Transparent header with greeting and notifications icon (right)
  - Scrollable content with safe area insets: top (headerHeight + 24px), bottom (tabBarHeight + 24px)
  - Cards for monthly spending summary, category breakdown chart, recent transactions list
- **Components**: Summary cards, donut chart, transaction list items

#### 2. Receipt Capture Screen (Modal)
- **Purpose**: Capture or upload receipt images
- **Layout**:
  - Full-screen camera view or image picker
  - Custom header with close button (left) and flash toggle (right)
  - Bottom action bar with capture button and gallery access
  - Safe area insets: top (insets.top + 16px), bottom (insets.bottom + 16px)
- **Components**: Camera preview, capture button, gallery thumbnail

#### 3. Receipt Processing Screen
- **Purpose**: Review OCR results and confirm/edit expense details
- **Layout**:
  - Default header with "Back" (left), "Save" (right)
  - Scrollable form with safe area insets: top (16px), bottom (tabBarHeight + 24px)
  - Receipt image preview at top, editable form fields below
  - Form fields: merchant name, amount, date, category selector
- **Components**: Image preview, text inputs, date picker, category dropdown

#### 4. Receipts List Screen
- **Purpose**: Browse all saved receipts
- **Layout**:
  - Transparent header with search bar and filter icon (right)
  - Scrollable list with safe area insets: top (headerHeight + 24px), bottom (tabBarHeight + 24px)
  - Grid layout of receipt thumbnails with merchant name and amount
- **Components**: Search bar, filter chips, receipt cards

#### 5. Accounts Screen
- **Purpose**: Manage linked financial accounts
- **Layout**:
  - Transparent header with "Add Account" button (right)
  - Scrollable list with safe area insets: top (headerHeight + 24px), bottom (tabBarHeight + 24px)
  - Account cards showing institution name, account type, last sync time
- **Components**: Account cards with sync status, add account button

#### 6. Account Linking Screen (Modal)
- **Purpose**: Connect new financial institution via Plaid
- **Layout**:
  - Default header with "Cancel" (left)
  - Centered content with safe area insets: top (16px), bottom (insets.bottom + 24px)
  - Plaid Link web view or mock institution selector
- **Components**: Institution search, connection status indicators

#### 7. Transactions Screen
- **Purpose**: View all imported transactions
- **Layout**:
  - Transparent header with filter/sort icon (right)
  - Scrollable list grouped by date with safe area insets: top (headerHeight + 24px), bottom (tabBarHeight + 24px)
  - Transaction items with merchant, amount, category badge
- **Components**: Date section headers, transaction list items, filter chips

#### 8. Profile/Settings Screen
- **Purpose**: User preferences and app settings
- **Layout**:
  - Transparent header with "Edit" button (right)
  - Scrollable content with safe area insets: top (headerHeight + 24px), bottom (tabBarHeight + 24px)
  - User avatar and name at top, settings sections below
- **Components**: Avatar picker (3 preset avatars with finance theme), settings list items

## Design System

### Color Palette
- **Primary**: Deep teal (#047857) - trust, financial stability
- **Secondary**: Amber (#F59E0B) - highlights, warnings
- **Success/Income**: Green (#10B981)
- **Expense/Alert**: Red (#EF4444)
- **Background**: White (#FFFFFF)
- **Surface**: Light gray (#F9FAFB)
- **Text Primary**: Dark gray (#111827)
- **Text Secondary**: Medium gray (#6B7280)
- **Border**: Light gray (#E5E7EB)

### Typography
- **Headings**: SF Pro Display (iOS) / Roboto (Android), weights 600-700
- **Body**: SF Pro Text (iOS) / Roboto (Android), weight 400
- **Numbers/Amounts**: SF Pro Display (iOS) / Roboto (Android), weight 600, tabular figures

### Visual Design
- **Icons**: Feather icons from @expo/vector-icons
  - Camera, Receipt, CreditCard, PieChart, User, Settings, Plus, Search, Filter
- **Shadows**: Subtle elevation for cards
  - Cards: shadowOffset {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2
  - FAB: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- **Corner Radius**: 12px for cards, 24px for buttons, 50% for FAB
- **Spacing**: 4px, 8px, 12px, 16px, 24px, 32px

### Interaction Design
- All touchable elements show pressed state (0.6 opacity)
- Swipe gestures on transaction/receipt items for quick actions (edit, delete)
- Pull-to-refresh on list screens for sync
- Haptic feedback on important actions (receipt capture, account sync)

### Critical Assets
1. **Profile Avatars (3 presets)**:
   - Minimalist geometric icons representing finance (piggy bank, wallet, chart)
   - Simple line art style, teal on white background
   - Square format, 200x200px
2. **Empty State Illustrations**:
   - No receipts: Simple receipt icon with dashed outline
   - No accounts: Bank building icon outline
   - Style: Line art, teal stroke, centered with helper text below

### Accessibility
- Minimum touch target size: 44x44px
- Color contrast ratio: 4.5:1 for text, 3:1 for UI elements
- Support for Dynamic Type (iOS) and font scaling (Android)
- Descriptive labels for screen readers on all interactive elements
- Alternative text for receipt images
- Clear error messages for failed OCR or sync operations