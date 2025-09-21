export const responseMemberSuccess = {
  data: {
    success: true,
    data: [
      {
        id: 1,
        user_id: null,
        name: "John Doe",
        email: "john.doe@example.com",
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
      email: "john.doe@example.com",
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
      email: "john.updated@example.com",
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
