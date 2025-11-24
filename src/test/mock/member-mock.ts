export const responseMemberSuccess = {
  data: {
    success: true,
    data: [
      {
        id: 1,
        user_id: null,
        name: "John Doe",
        username: "johndoe",
        gender: "Male",
        birthdate: "1990-01-01",
        address: "Jakarta, Indonesia",
        phone: "08123456789",
        photo: "http://localhost:8000/storage/members/agYK6mr27hnPVXsBZg5r5wu5lLFx9gdrE83dZcJX.jpg",
        active: true,
        has_user_account: false,
        created_by: 1,
        updated_by: null,
        created_at: "2025-09-13T22:25:00.000000Z",
        updated_at: "2025-09-13T22:25:00.000000Z"
      }
    ],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 1,
      from: 1,
      to: 1
    }
  },
  status: 200,
  statusText: 'OK'
};

export const responseMemberDetailSuccess = {
  data: {
    success: true,
    data: {
      id: 1,
      user_id: null,
      name: "John Doe",
      username: "johndoe",
      gender: "Male",
      birthdate: "1990-01-01",
      address: "Jakarta, Indonesia",
      phone: "08123456789",
      photo: "http://localhost:8000/storage/members/agYK6mr27hnPVXsBZg5r5wu5lLFx9gdrE83dZcJX.jpg",
      active: true,
      has_user_account: false,
      created_by: 1,
      updated_by: null,
      created_at: "2025-09-13T22:25:00.000000Z",
      updated_at: "2025-09-13T22:25:00.000000Z"
    }
  },
  status: 200,
  statusText: 'OK'
};

export const responseMemberUpdateSuccess = {
  data: {
    success: true,
    data: {
      id: 1,
      user_id: null,
      name: "John Updated",
      username: "johnupdated",
      gender: "Female",
      birthdate: "1995-05-15",
      address: "Surabaya, Jawa Timur, Indonesia",
      phone: "08123456788",
      photo: "http://localhost:8000/storage/members/updated_photo.jpg",
      active: true,
      has_user_account: false,
      created_by: 1,
      updated_by: 1,
      created_at: "2025-09-13T22:25:00.000000Z",
      updated_at: "2025-09-13T22:30:00.000000Z"
    },
    message: "Member updated successfully"
  },
  status: 200,
  statusText: 'OK'
};

export const responseMemberError = {
  response: {
    data: { message: 'Error occurred' },
    status: 400
  }
};

export const responseCreateUserSuccess = {
  data: {
    success: true,
    message: "Success to add data user.",
    data: {
      id: 42,
      email: "user@example.com",
      name: "John Doe",
      gender: "Male",
      birthdate: "1990-01-01T00:00:00.000Z",
      photo: null,
      active: "Active",
      role_id: 1,
      created_by: 7,
      created_at: "2025-11-09T07:15:12.123Z",
      updated_by: null,
      updated_at: "2025-11-09T07:15:12.123Z"
    }
  },
  status: 200,
  statusText: 'OK'
};

export const responseCreateUserError = {
  response: {
    data: { 
      message: 'Error occurred',
      errors: ['Validation error']
    },
    status: 400
  }
};