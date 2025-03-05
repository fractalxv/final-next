'use client';
import { logout } from "../actions/auth";

export default function LogoutButton() {

  return <button onClick={() => logout()}>Logout</button>
}