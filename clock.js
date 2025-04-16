function Clock() {
    const [time, setTime] = React.useState(new Date());
    const [showCalendar, setShowCalendar] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [selectedTimezone, setSelectedTimezone] = React.useState(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const [showTimezones, setShowTimezones] = React.useState(false);
    
    // Added the requested timezones
    const timezones = [
      "UTC",
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "Europe/London",
      "Europe/Paris",
      "Asia/Kolkata",     // Added India/Kolkata
      "Asia/Karachi",     // Added Karachi
      "Asia/Tokyo",
      "Australia/Sydney",
      "Pacific/Auckland"
    ];
    
    // Update time every second
    React.useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
      
      return () => clearInterval(timer);
    }, []);
    
    // Handle clicking outside the calendar or timezone selector
    React.useEffect(() => {
      function handleClickOutside(event) {
        if (
          showCalendar && 
          !event.target.closest('.calendar-container') && 
          !event.target.closest('.calendar-toggle')
        ) {
          setShowCalendar(false);
        }
        
        if (
          showTimezones && 
          !event.target.closest('.timezone-container') && 
          !event.target.closest('.timezone-toggle')
        ) {
          setShowTimezones(false);
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCalendar, showTimezones]);
    
    // Format time based on selected timezone
    const formatTime = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: selectedTimezone
      }).format(date);
    };
    
    // Format date based on selected timezone
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: selectedTimezone
      }).format(date);
    };
    
    // Get number of days in month
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };
    
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay();
    };
    
    // Render the calendar UI
    const renderCalendar = () => {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDay = getFirstDayOfMonth(year, month);
      
      const days = [];
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      
      // Empty cells for days before the first day of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
      }
      
      // Days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        const isToday = 
          new Date().getDate() === i && 
          new Date().getMonth() === month && 
          new Date().getFullYear() === year;
        
        const isSelected = 
          selectedDate.getDate() === i && 
          selectedDate.getMonth() === month && 
          selectedDate.getFullYear() === year;
        
        const cellClass = `day-cell ${isToday ? 'day-today' : ''} ${isSelected && !isToday ? 'day-selected' : ''}`;
        
        days.push(
          <div 
            key={i} 
            className={cellClass}
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(i);
              setSelectedDate(newDate);
            }}
          >
            {i}
          </div>
        );
      }
      
      return (
        <div className="calendar-container">
          <div className="month-nav">
            <button 
              className="month-button"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedDate(newDate);
              }}
            >
              &lt;
            </button>
            <div className="month-display">
              <div className="month-name">{monthName}</div>
              <div className="year-number">{year}</div>
            </div>
            <button 
              className="month-button"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedDate(newDate);
              }}
            >
              &gt;
            </button>
          </div>
          
          <div className="weekday-header">
            <div className="weekday">Su</div>
            <div className="weekday">Mo</div>
            <div className="weekday">Tu</div>
            <div className="weekday">We</div>
            <div className="weekday">Th</div>
            <div className="weekday">Fr</div>
            <div className="weekday">Sa</div>
          </div>
          
          <div className="days-grid">
            {days}
          </div>
          
          <button 
            className="today-button"
            onClick={() => {
              setSelectedDate(new Date());
            }}
          >
            Today
          </button>
        </div>
      );
    };
    
    // Render the timezone selector
    const renderTimezoneSelector = () => {
      return (
        <div className="timezone-container">
          {timezones.map(timezone => {
            const isSelected = selectedTimezone === timezone;
            const className = `timezone-option ${isSelected ? 'timezone-selected' : ''}`;
            
            return (
              <div 
                key={timezone} 
                className={className}
                onClick={() => {
                  setSelectedTimezone(timezone);
                  setShowTimezones(false);
                }}
              >
                {timezone.replace('_', ' ')}
              </div>
            );
          })}
        </div>
      );
    };
    
    // Main component render
    return (
      <div className="clock-container">
        <div className="clock-panel">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <div style={{ position: 'relative', marginLeft: 'auto' }}>
              <button 
                className="timezone-toggle"
                onClick={() => setShowTimezones(!showTimezones)}
              >
                {selectedTimezone.split('/').pop().replace('_', ' ')}
                <span style={{ marginLeft: '0.5rem' }}>{showTimezones ? '▲' : '▼'}</span>
              </button>
              {showTimezones && renderTimezoneSelector()}
            </div>
          </div>
          
          <div className="time-display">{formatTime(time)}</div>
          <div className="date-display">{formatDate(time)}</div>
          
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <button 
              className="calendar-toggle"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <span style={{ marginRight: '0.5rem' }}>Calendar</span>
              <span>{showCalendar ? '▲' : '▼'}</span>
            </button>
            {showCalendar && renderCalendar()}
          </div>
        </div>
      </div>
    );
  }
  
  // Render the app
  ReactDOM.render(<Clock />, document.getElementById('root'));