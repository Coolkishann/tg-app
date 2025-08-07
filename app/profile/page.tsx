"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Calendar,
  ShoppingBag,
  DollarSign,
  Heart,
  Settings,
  LogOut,
  Loader2,
  Edit3,
  Save,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/store/auth-store"
import { useTelegram } from "@/hooks/use-telegram"
import type { UserProfile } from "@/types"

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
  })
  const [saving, setSaving] = useState(false)

  const router = useRouter()
  const { user, token, logout, isAuthenticated } = useAuthStore()
  const { closeMiniApp } = useTelegram()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    fetchProfile()
  }, [isAuthenticated, router])

  const fetchProfile = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
        setEditForm({
          first_name: data.profile.first_name || "",
          last_name: data.profile.last_name || "",
          username: data.profile.username || "",
        })
      } else {
        setError(data.error || "Failed to load profile")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Profile fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!token) return

    try {
      setSaving(true)
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      })

      const data = await response.json()

      if (data.success) {
        // Update profile state
        if (profile) {
          setProfile({
            ...profile,
            ...editForm,
          })
        }
        setIsEditing(false)
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Profile update error:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load profile</p>
          <Button onClick={fetchProfile} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name} ${profile.last_name}`}
              />
              <AvatarFallback className="text-lg">{getInitials(profile.first_name, profile.last_name)}</AvatarFallback>
            </Avatar>
          </div>

          {!isEditing ? (
            <div className="space-y-2">
              <CardTitle className="text-xl">
                {profile.first_name} {profile.last_name}
              </CardTitle>
              {profile.username && <p className="text-muted-foreground">@{profile.username}</p>}
            </div>
          ) : (
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">ID: {profile.id}</Badge>
            {profile.language_code && <Badge variant="outline">{profile.language_code.toUpperCase()}</Badge>}
            {profile.is_premium && <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">Premium</Badge>}
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{profile.orderCount || 0}</p>
            <p className="text-sm text-muted-foreground">Orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">${(profile.totalSpent || 0).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Member Since</span>
            </div>
            <span className="text-sm font-medium">{formatDate(profile.joinDate)}</span>
          </div>

          {profile.favoriteCategory && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Favorite Category</span>
              </div>
              <Badge variant="secondary" className="capitalize">
                {profile.favoriteCategory}
              </Badge>
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-sm">Telegram User ID</span>
            <span className="text-sm font-mono">{profile.id}</span>
          </div>

          {profile.language_code && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Language</span>
              <span className="text-sm">{profile.language_code.toUpperCase()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/")}>
          <Settings className="w-4 h-4 mr-2" />
          Back to Store
        </Button>

        <Button variant="outline" className="w-full bg-transparent" onClick={closeMiniApp}>
          Close Mini App
        </Button>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
