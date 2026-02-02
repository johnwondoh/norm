# Inline Editing Guide

## Overview
The employee details page now supports inline editing for individual fields. Users can click on editable fields to modify them directly without opening a modal or separate form.

## Features

### ✨ User Experience
- **Hover to reveal edit button**: Edit icons appear when hovering over editable fields
- **Click to edit**: Click the edit icon or the field itself to enter edit mode
- **Inline input**: Input field appears directly in place of the display value
- **Save/Cancel controls**: Check mark to save, X to cancel changes
- **Keyboard shortcuts**:
  - `Enter` to save (single-line fields)
  - `Escape` to cancel
- **Optimistic updates**: UI updates immediately while saving in background
- **Auto-focus and select**: Input is automatically focused and text selected when entering edit mode

### 🎨 Field Types Supported
1. **Text fields** (default) - for names, roles, etc.
2. **Email fields** - with email validation
3. **Phone fields** - for phone numbers
4. **Date fields** - for dates
5. **Select/dropdown** - for status, department, etc.
6. **Multiline textarea** - for addresses or longer text

## Implementation

### Basic Usage

```tsx
import { EditableDataField } from "@/components/dynamicSectionContent";

<EditableDataField
  label="First Name"
  value={employee.first_name}
  theme="blue"
  editable
  onSave={(value) => handleFieldSave('first_name', value)}
/>
```

### Field Type Examples

#### 1. Simple Text Field
```tsx
<EditableDataField
  label="First Name"
  value={employee.first_name}
  theme="blue"
  editable
  onSave={(value) => handleFieldSave('first_name', value)}
/>
```

#### 2. Email Field
```tsx
<EditableDataField
  label="Email Address"
  value={employee.email}
  icon={Mail}
  theme="blue"
  editable
  type="email"
  onSave={(value) => handleFieldSave('email', value)}
/>
```

#### 3. Phone Field
```tsx
<EditableDataField
  label="Phone Number"
  value={employee.phone}
  icon={Phone}
  theme="blue"
  editable
  type="tel"
  onSave={(value) => handleFieldSave('phone', value)}
/>
```

#### 4. Dropdown/Select Field
```tsx
<EditableDataField
  label="Employment Status"
  value={employee.status}
  theme="purple"
  editable
  type="select"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ]}
  onSave={(value) => handleFieldSave('status', value)}
/>
```

#### 5. Multiline Text Field
```tsx
<EditableDataField
  label="Address"
  value={employee.address}
  icon={MapPin}
  theme="blue"
  editable
  multiline
  onSave={(value) => handleFieldSave('address', value)}
/>
```

#### 6. Non-Editable Field (Read-Only)
```tsx
<DataField
  label="Employee ID"
  value={`#${employee.id}`}
  theme="blue"
/>
```

## API Integration

### Server Action
The `updateEmployee` server action handles all database updates:

```typescript
// app/employees/[id]/actions.ts
export async function updateEmployee(
  employeeId: number,
  updates: Partial<Employee>
): Promise<{ success: boolean; error?: string }>
```

### Client Handler
The `handleFieldSave` function in `EmployeeDetailsClient` manages the update flow:

```typescript
const handleFieldSave = async (field: keyof Employee, value: string) => {
  const updates = { [field]: value };
  const result = await updateEmployee(employee.id, updates);

  if (result.success) {
    // Update local state optimistically
    setLocalEmployee(prev => ({ ...prev, [field]: value }));
    // Refresh server data in background
    router.refresh();
  } else {
    alert(`Failed to save: ${result.error}`);
    throw new Error(result.error);
  }
};
```

## Sections Updated

### ✅ Personal Information
- First Name (editable)
- Last Name (editable)
- Email Address (editable, type: email)
- Phone Number (editable, type: tel)
- Address (editable, multiline)
- State (editable)
- Post Code (editable)
- Employee ID (read-only)

### ✅ Employment Details
- Position/Role (editable)
- Department (editable)
- Employment Status (editable, dropdown)
- Join Date (read-only)
- Employment Type (read-only)
- Reports To (read-only)

### 🔄 Sections You Can Extend

To add inline editing to other sections (Payroll, Performance, Schedule, etc.):

1. Replace `<DataField>` with `<EditableDataField>`
2. Add the `editable` prop
3. Add an `onSave` handler with the field name
4. Optionally specify `type`, `options`, or `multiline`

Example:
```tsx
<EditableDataField
  label="Base Salary"
  value={employee.salary}
  theme="green"
  editable
  onSave={(value) => handleFieldSave('salary', value)}
/>
```

## Styling

The component uses Tailwind CSS with theme colors. Each section has its own theme:
- `blue` - Personal Information
- `purple` - Employment Details
- `green` - Payroll
- `orange` - Performance
- `pink` - Schedule
- `indigo` - Documents
- `red` - Compliance

## Error Handling

Errors are currently shown via `alert()`. You can customize this by updating the error handling in `handleFieldSave`:

```typescript
if (!result.success) {
  // Replace with your preferred error notification
  toast.error(`Failed to save: ${result.error}`);
  throw new Error(result.error);
}
```

## Next Steps

### Enhancements You Can Add:
1. **Toast notifications** instead of alerts
2. **Loading indicators** during save
3. **Validation** before saving (e.g., email format, required fields)
4. **Undo/redo** functionality
5. **Audit trail** showing who edited what and when
6. **Permission-based editing** (some users can only edit certain fields)
7. **Bulk edit mode** to edit multiple fields at once
8. **Auto-save** after a delay instead of explicit save button

## File Structure

```
app/employees/[id]/
├── actions.ts                    # Server actions for updates
├── EmployeeDetailsClient.tsx     # Main component with inline editing
└── page.tsx                      # Server component wrapper

components/dynamicSectionContent/
├── EditableDataField.tsx         # Inline editable field component
├── DataField.tsx                 # Read-only field component
└── index.ts                      # Exports
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Keyboard navigation supported
- Mobile-friendly (tap to edit)

## Accessibility

- Proper ARIA labels
- Keyboard navigation (Tab, Enter, Escape)
- Focus management
- Screen reader friendly

---

**Note**: The inline editing is now fully functional on your employee details page at `app/employees/[id]`. Users can hover over editable fields, click the edit icon, make changes, and save directly without leaving the page.
